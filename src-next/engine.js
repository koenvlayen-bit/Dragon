/* ═══════════ ENGINE: state, rules, persistence ═══════════ */
const SAVE_KEY = 'eh-warmth-save-v1';
const META_KEY = 'eh-warmth-meta-v1';

function freshState(){
  return {
    v:1, screen:'title', name:null,
    look:{ color:'crimson', horns:'ram', hide:'armored', tail:'club', element:'fire' },
    stage:0, hp:50, maxHp:50, gold:0, hope:10, dread:0, wild:0,
    season:0, flights:3, flags:{}, places:{ kettle:'frozen', ashby:'frozen', hollin:'frozen' },
    upgrades:{ vents:0, pool:0, forge:0 }, done:{}, hunted:-1,
    scene:null, out:null, battle:null, report:null, sel:'kettle', chapterDone:false,
  };
}
let S = freshState();
function save(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(e){} }
function load(){ try{ const r = localStorage.getItem(SAVE_KEY); if(r){ return Object.assign(freshState(), JSON.parse(r)); } }catch(e){} return null; }
function wipe(){ try{ localStorage.removeItem(SAVE_KEY); }catch(e){} }

function loadMeta(){ try{ return Object.assign({ ach:{}, runs:0 }, JSON.parse(localStorage.getItem(META_KEY) || '{}')); }catch(e){ return { ach:{}, runs:0 }; } }
let META = loadMeta();
function saveMeta(){ try{ localStorage.setItem(META_KEY, JSON.stringify(META)); }catch(e){} }
let pendingAch = [];
function unlock(id){ if(META.ach[id]) return; META.ach[id] = Date.now(); saveMeta(); const a = ACH.find(x => x.id === id); if(a) pendingAch.push(a); }

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const R = (v, s = S) => typeof v === 'function' ? v(s) : v;

/* ── Warmth ── */
function radius(s = S){ return 14 + Math.min(16, s.gold / 12) + 7 * s.upgrades.vents + (s.flags.ember ? 5 : 0); }
function dist(a, b){ const dx = a.x - b.x, dy = (a.y - b.y) * (2/3); return Math.sqrt(dx*dx + dy*dy); }
function warmAt(id, s = S){
  const p = PLACES[id]; if(!p) return false;
  if(id === 'lair' || id === 'warren') return true;
  if(s.places[id] === 'kindled' || s.places[id] === 'saved') return true;
  return dist(p, LAIR) <= radius(s);
}
function placeState(id, s = S){
  if(PLACES[id].kind === 'village'){
    const st = s.places[id];
    if(st === 'lost') return 'lost';
    if(st === 'kindled') return 'kindled';
    if(st === 'saved') return 'saved';
    return warmAt(id, s) ? 'warm' : 'frozen';
  }
  if(PLACES[id].kind === 'locked' && (s.chapter || 1) < 2) return 'locked';
  return warmAt(id, s) ? 'warm' : 'frozen';
}
function glowLevel(s = S){ return Math.round(radius(s)); }

/* ── Effects ── */
function applyFx(fx, s = S){
  if(!fx) return [];
  fx = R(fx, s);
  const shown = [];
  const num = (k, label, cls, max) => {
    if(!fx[k]) return;
    const before = s[k];
    s[k] = max ? clamp(s[k] + fx[k], 0, max) : Math.max(0, s[k] + fx[k]);
    const d = s[k] - before;
    if(d) shown.push({ t:`${label} ${d > 0 ? '+' : ''}${d}`, c: cls || (d > 0 ? 'up' : 'down') });
  };
  if(fx.maxHp){ s.maxHp += fx.maxHp; s.hp += fx.maxHp; shown.push({ t:`Max health +${fx.maxHp}`, c:'up' }); }
  num('hp', 'Health', null, s.maxHp);
  num('gold', 'Hoard', 'gold');
  num('hope', 'Hope', 'hope', 100);
  num('dread', 'Dread', 'dread', 100);
  num('wild', 'Wildness', 'wild', 100);
  if(fx.flags) Object.assign(s.flags, fx.flags);
  if(fx.kindle){ s.places[fx.kindle] = 'kindled'; shown.push({ t:`${PLACES[fx.kindle].name} is kindled`, c:'glow' }); }
  if(fx.lose){ s.places[fx.lose] = 'lost'; shown.push({ t:`${PLACES[fx.lose].name} is lost`, c:'down' }); }
  if(fx.done) s.done[fx.done] = true;
  if(fx.ach) [].concat(fx.ach).forEach(unlock);
  if(fx.note) shown.push({ t:fx.note, c:'info' });
  if(s.dread >= 60) unlock('feared');
  if(s.hope >= 60) unlock('beloved');
  return shown;
}

/* ── Seasons ── */
function season(s = S){ return SEASONS[s.season]; }
function tribute(s = S){
  let g = 0; const lines = [];
  VILLAGES.forEach(v => { const st = placeState(v, s); if(st === 'kindled' || st === 'warm' || st === 'saved'){ const t = 6 + Math.floor(s.hope / 10); g += t; lines.push([`${PLACES[v].name} sends tribute`, `+${t}`]); } });
  const gob = { allied:10, vassal:14, terrified:8 }[s.flags.goblins];
  if(gob){ g += gob; lines.push(['The goblins dig gold', `+${gob}`]); }
  return { g, lines };
}
/* Ends the current season: returns a report for the summary screen */
function endSeason(s = S){
  const rep = { from: season(s).name, lines:[], villages:[] };
  const t = tribute(s); s.gold += t.g; t.lines.forEach(l => rep.lines.push({ t:l[0], v:l[1], good:true }));
  const heal = Math.min(s.maxHp - s.hp, Math.round(s.maxHp * .25 + s.hope / 5));
  if(heal > 0){ s.hp += heal; rep.lines.push({ t:'You sleep on your hoard', v:`+${heal} health`, good:true }); }
  // growth
  const ch1 = (s.chapter || 1) < 2;
  const grow = ch1 ? { 0:1, 2:2 }[s.season] : undefined;
  if(grow !== undefined && s.stage < grow){
    s.stage = grow; const add = STAGE_HP[grow] - STAGE_HP[grow - 1]; s.maxHp += add; s.hp += add;
    rep.lines.push({ t:`You grow into a ${STAGES[grow].toLowerCase()}`, v:`+${add} max health`, good:true });
  }
  s.season++;
  // winter arrives: the frost judges every village
  if(ch1 && s.season === 3){
    VILLAGES.forEach(v => {
      const st = placeState(v, s);
      if(st === 'frozen'){ s.places[v] = 'lost'; s.hope = clamp(s.hope - 8, 0, 100); rep.villages.push({ v, ok:false }); }
      else { s.places[v] = 'saved'; s.hope = clamp(s.hope + 6, 0, 100); rep.villages.push({ v, ok:true }); }
    });
    if(rep.villages.every(x => x.ok)) unlock('hearths');
  }
  if(s.season < SEASONS.length) s.flights = SEASONS[s.season].flights;
  s.hunted = -1;
  return rep;
}

/* ── What waits at each place ── */
function eventAt(id, s = S){
  if((s.chapter || 1) >= 2) return eventAt2(id, s);
  const f = s.flags, d = s.done, se = s.season;
  switch(id){
    case 'warren':
      if(!d.warren) return { scene:'warren', label:'Goblins are gathering at the tunnel mouth.' };
      if(f.goblins === 'allied' && se >= 1 && !d.snikkit) return { scene:'snikkit', label:'Snikkit wants a word about your hoard.' };
      return null;
    case 'kettle':
      if(s.places.kettle === 'lost') return null;
      if(!d.kettle) return { scene:'kettle', label:'The village is freezing.' };
      if(se === 3 && !d.kettleWinter && s.places.kettle === 'saved') return { scene:'kettleWinter', label:'Kettle is holding a winter feast.' };
      return null;
    case 'pines':
      if(s.hunted === se) return null;
      return { scene:'pines', label: se >= 2 ? 'A bigger pack has gathered.' : 'Wolves circle in the pines.' };
    case 'hut':
      if(se < 1) return null;
      if(!d.hut) return { scene:'hut', label:'A warm window, and someone waiting.' };
      return null;
    case 'ashby':
      if(s.places.ashby === 'lost') return null;
      if(se >= 1 && !d.ashby) return { scene:'ashby', label:'Riders in grey are at the ford.' };
      if(d.ashby && s.places.ashby === 'frozen' && se <= 2) return { scene:'ashbyKindle', label:'Ashby could still be warmed.' };
      return null;
    case 'hollin':
      if(s.places.hollin === 'lost') return null;
      if(se >= 1 && s.places.hollin === 'frozen' && se <= 2) return { scene:'hollin', label:'Hollin is starving in the cold.' };
      return null;
    case 'pass':
      if(se === 3 && !d.grinder) return { scene:'grinderPass', label:'The Grinder walks the pass tonight.' };
      return null;
  }
  return null;
}
function anyEvents(s = S){ return Object.keys(PLACES).some(id => eventAt(id, s)); }
