/* ═══════════ BATTLE ═══════════ */
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const rnd = () => Math.random();

function pow(){ return STAGE_POW[S.stage] * (1 + S.wild / 200); }
function startBattle(encId, win, lose){
  if(encId === '__pines') encId = S.season >= 2 ? 'pack' : 'wolves';
  const enc = ENCOUNTERS[encId];
  const hpScale = 1 + S.season * 0.12 + ((S.chapter || 1) >= 2 ? .3 : 0);
  const foes = enc.foes.map((k, i) => {
    const e = ENEMIES[k]; const max = Math.round(e.hp * (e.tags.includes('boss') ? 1 : hpScale));
    return { i, key:k, name:e.name, art:e.art, sil:e.sil, hp:max, max, tags:e.tags, moves:e.moves, mi:(i % e.moves.length), intent:null, st:{} };
  });
  const B = { enc:encId, breakAt:enc.breakAt || 0, redeem:!!enc.redeem, bg:enc.bg, flee:enc.flee, foes, tgt:0, turn:1, win, lose, busy:false, log:'', dawn:enc.dawn || 0,
    me:{ heat:4, st:{} } };
  if(S.flags.ward) B.me.st.block = 8;
  foes.forEach(f => {
    if(f.tags.includes('beast') && S.dread >= 35) f.st.fear = 2;
    if(f.tags.includes('human') && S.dread >= 60) f.st.fear = 2;
  });
  S.battle = B; S.screen = 'battle';
  pickIntents(B);
  B.log = foes.length > 1 ? `${foes.length} enemies close in.` : `${foes[0].name} closes in.`;
  if(S.flags.ward) B.log += ' Mirelle\'s ward glows on your chest.';
}

function alive(B){ return B.foes.filter(f => f.hp > 0); }
function pickIntents(B){
  alive(B).forEach(f => {
    let m = f.moves[f.mi % f.moves.length]; f.mi++;
    if(m === 'howl' && alive(B).filter(x => x.key === f.key || x.key === 'pup' || x.key === 'wolf').length < 2) m = 'bite';
    if(m === 'mend' && !alive(B).some(x => x !== f && x.hp < x.max)) m = 'bolt';
    if(m === 'chain' && B.me.st.stun) m = 'chill';
    if(m === 'vchains' && B.me.st.stun) m = 'coldfire';
    if(m === 'net' && B.me.st.stun) m = 'spear';
    f.intent = m;
  });
}
function foeDmg(f, base){
  let d = base + (f.st.fury || 0) * 2;
  if(f.st.fear) d = Math.round(d * .7);
  return d;
}
function intentView(f){
  const m = MOVES[f.intent]; if(!m) return null;
  if(m.k === 'atk') return { c:'atk', t:`⚔ ${foeDmg(f, m.dmg)}` };
  if(m.k === 'def') return { c:'def', t:`⛨ ${m.blk}` };
  if(m.k === 'wind') return { c:'wind', t:'⚠ Winding up' };
  return { c:'spc', t:`✦ ${m.label}${m.dmg ? ' ' + foeDmg(f, m.dmg) : ''}` };
}

/* ── Player actions ── */
function actions(B){
  const L = S.look, forge = S.upgrades.forge;
  const t = B.foes[B.tgt];
  const canDevour = t && t.hp > 0 && !t.tags.includes('boss') && t.hp <= t.max * .25;
  const list = [
    { id:'claw',   name:'Claw',  d:`${Math.round((5 + forge * 3) * pow())} damage`, cost:0 },
    { id:'breath', name:BREATH[L.element].name, d:BREATH[L.element].d, cost:4, cls:'breath' },
    { id:'tail',   name:TAIL[L.tail].name, d:TAIL[L.tail].d, cost:2 },
    { id:'guard',  name:GUARD[L.hide].name, d:GUARD[L.hide].d, cost:1 },
    { id:'roar',   name:'Roar',  d:'Enemies hit 30% softer for 2 turns', cost:1 },
  ];
  if(B.redeem && t && t.hp > 0 && t.hp <= t.max * .5 && canRedeem()) list.unshift({ id:'offer', name:'Offer your fire', d:'Breathe warmth into his chains, not into him', cost:4, cls:'breath' });
  if(canDevour) list.push({ id:'devour', name:'Devour', d:'Finish it. Heal 10.', cost:0 });
  else if(B.flee) list.push({ id:'flee', name:'Fly away', d:'Leave the fight', cost:0 });
  return list;
}

function hit(B, f, amount, opts = {}){
  if(f.hp <= 0) return 0;
  let d = Math.max(0, Math.round(amount));
  if(opts.breath && f.tags.includes('frost')) d = Math.round(d * 1.5);
  if(f.st.block){ const a = Math.min(f.st.block, d); f.st.block -= a; d -= a; if(a) fx('blk', f, `⛨${a}`); }
  f.hp = Math.max(0, f.hp - d);
  if(d) fx('dmg', f, `-${d}`);
  return d;
}

async function playerAct(id){
  const B = S.battle; if(!B || B.busy) return;
  const me = B.me, P = pow();
  if(me.st.stun){ me.st.stun = 0; B.log = 'You tear free of the chains.'; return enemyPhase(B); }
  const act = actions(B).find(a => a.id === id); if(!act) return;
  if(me.heat < act.cost) return;
  let t = B.foes[B.tgt]; if(!t || t.hp <= 0){ B.tgt = B.foes.findIndex(f => f.hp > 0); t = B.foes[B.tgt]; }
  me.heat -= act.cost;
  const chillPen = me.st.chill ? 2 : 0;
  B.busy = true;
  switch(id){
    case 'claw': { const d = hit(B, t, (5 + S.upgrades.forge * 3) * P - chillPen); B.log = `You rake ${t.name} for ${d}.`; anim('claw', t); break; }
    case 'breath': {
      const soak = me.st.soak ? .5 : 1, el = S.look.element;
      anim('breath', el === 'gold' || el === 'fluid' ? null : t);
      if(el === 'fire'){ const d = hit(B, t, 9 * P * soak - chillPen, { breath:true }); if(t.hp > 0) t.st.burn = (t.st.burn || 0) + 3; B.log = `Dragonfire! ${d} damage, and ${t.name} burns.`; }
      if(el === 'shadow'){ const d = hit(B, t, 8 * P * soak - chillPen, { breath:true }); if(t.hp > 0) t.st.blind = 2; B.log = `Black flame: ${d} damage. ${t.name} can barely see.`; }
      if(el === 'gold'){ let tot = 0; alive(B).forEach(f => tot += hit(B, f, 5 * P * soak - chillPen, { breath:true })); me.st.block = (me.st.block || 0) + 6; B.log = `Molten gold washes over everything: ${tot} damage, and it cools on your scales as armour.`; }
      if(el === 'fluid'){ let tot = 0; alive(B).forEach(f => tot += hit(B, f, 6 * P * soak - chillPen, { breath:true })); delete me.st.chill; delete me.st.soak; B.log = `Scalding steam: ${tot} damage, and the frost on you boils away.`; }
      if(me.st.soak) B.log += ' (Soaked: half power.)';
      break; }
    case 'tail': {
      const tb = S.upgrades.forge * 2;
      anim('claw', t);
      if(S.look.tail === 'club'){ const d = hit(B, t, (6 + tb) * P - chillPen); if(t.hp > 0 && !t.st.stunImmune && !t.tags.includes('boss')){ t.st.stun = 1; B.log = `Your tail club lands: ${d}. ${t.name} is stunned.`; } else B.log = `Your tail club lands: ${d}.${t.tags.includes('boss') ? ' Too big to stun.' : ''}`; }
      if(S.look.tail === 'whip'){ let d = 0; for(let k = 0; k < 3; k++) d += hit(B, t, (3 + tb / 2) * P - chillPen / 2); B.log = `Three lashes: ${d} damage.`; }
      if(S.look.tail === 'venom'){ const d = hit(B, t, (3 + tb) * P); if(t.hp > 0) t.st.poison = (t.st.poison || 0) + 4; B.log = `The barb sinks in: ${d}, and poison.`; }
      if(S.look.tail === 'fin'){ let tot = 0; alive(B).forEach(f => tot += hit(B, f, (4 + tb) * P - chillPen)); me.st.evade = 1; B.log = `You sweep the field: ${tot} damage. You will dodge the next blow.`; }
      break; }
    case 'guard': {
      const h = S.look.hide;
      me.st.block = (me.st.block || 0) + (h === 'armored' ? 12 : 7);
      if(h === 'ridged') me.st.thorns = 4;
      if(h === 'leathery') me.st.heatNext = 2;
      if(h === 'strange'){ ['chill','soak','stun'].forEach(k => delete me.st[k]); }
      B.log = { armored:'You tuck in behind armoured scales.', ridged:'Your plates bristle like spears.', leathery:'You cloak yourself in your wings and gather heat.', strange:'Your hide flares bright and burns the frost away.' }[h];
      fx('blk', 'me', `⛨${me.st.block}`);
      break; }
    case 'roar': alive(B).forEach(f => f.st.fear = 2); S.wild = clamp(S.wild + 1, 0, 100); B.log = 'You roar. The mountain answers. They falter.'; anim('roar'); break;
    case 'devour': {
      t.hp = 0; S.hp = Math.min(S.maxHp, S.hp + 10); S.wild = clamp(S.wild + 3, 0, 100);
      if(t.tags.includes('human')){ S.dread = clamp(S.dread + 4, 0, 100); S.hope = clamp(S.hope - 2, 0, 100); }
      fx('heal', 'me', '+10'); B.log = `You finish ${t.name} the old way.`; break; }
    case 'flee': B.busy = false; return endBattle(B, 'fled');
    case 'offer': S.flags.vexarFreed = true; B.log = 'You breathe on the chains. Not on him. On the chains.'; anim('breath', t); render(); await sleep(900); return endBattle(B, 'win');
  }
  render();
  await sleep(420);
  if(!alive(B).length) return endBattle(B, 'win');
  if(B.breakAt && B.foes.some(f => f.hp > 0 && f.hp <= f.max * B.breakAt)) return endBattle(B, 'win');
  if(B.tgt >= 0 && B.foes[B.tgt].hp <= 0){ B.tgt = B.foes.findIndex(f => f.hp > 0); }
  return enemyPhase(B);
}

async function enemyPhase(B){
  B.busy = true;
  const me = B.me;
  for(const f of alive(B)){
    if(f.st.stun){ f.st.stun = 0; f.st.stunImmune = 1; B.log = `${f.name} is stunned and does nothing.`; render(); await sleep(380); continue; }
    delete f.st.block;
    const m = MOVES[f.intent];
    const strike = (base) => {
      if(f.st.blind && rnd() < .5){ B.log = `${f.name} ${m.t}, and misses in the dark.`; return -1; }
      if(me.st.evade){ me.st.evade = 0; B.log = `${f.name} ${m.t}, and you slip aside.`; return -1; }
      let d = foeDmg(f, base);
      if(me.st.block){ const a = Math.min(me.st.block, d); me.st.block -= a; d -= a; }
      S.hp = Math.max(0, S.hp - d);
      if(me.st.thorns){ f.hp = Math.max(0, f.hp - me.st.thorns); fx('dmg', f, `-${me.st.thorns}`); }
      fx('dmg', 'me', d ? `-${d}` : '⛨'); shake('me');
      return d;
    };
    switch(f.intent){
      case 'howl': alive(B).forEach(x => x.st.fury = (x.st.fury || 0) + 1); B.log = 'The wolves howl, and their eyes go bright.'; break;
      case 'shield': case 'rime': case 'brood': f.st.block = m.blk; B.log = `${f.name} ${m.t}.`; break;
      case 'windup': B.log = 'The Grinder raises his club high. Brace yourself.'; break;
      case 'douse': { const d = strike(m.dmg); if(d >= 0){ me.st.soak = 2; me.heat = Math.max(0, me.heat - 1); B.log = `${f.name} douses you in ice water (${d}). Your fire sputters.`; } break; }
      case 'chill': case 'coldfire': { const d = strike(m.dmg); if(d >= 0){ me.st.chill = 2; B.log = `Frost creeps over your scales (${d}). You feel slow.`; } break; }
      case 'chain': case 'net': case 'vchains': { const d = strike(m.dmg); if(d >= 0){ me.st.stun = 1; B.log = `Iron chains snap around your wings (${d}). You lose your next turn.`; } break; }
      case 'mend': { const w = alive(B).filter(x => x !== f).sort((a, b) => a.hp / a.max - b.hp / b.max)[0]; if(w){ w.hp = Math.min(w.max, w.hp + 10); fx('heal', w, '+10'); B.log = `${f.name} mends ${w.name}.`; } break; }
      case 'grab': { const d = strike(m.dmg); if(d >= 0){ f.hp = Math.min(f.max, f.hp + m.heal); B.log = `The Grinder grabs and chews (${d}). He looks pleased.`; } break; }
      default: { const d = strike(m.dmg); if(d >= 0) B.log = `${f.name} ${m.t}: ${d} damage.`; }
    }
    if(f.st.blind) f.st.blind--;
    render(); await sleep(480);
    if(S.hp <= 0) return endBattle(B, 'lose');
  }
  // end of round
  B.foes.forEach(f => {
    if(f.hp <= 0) return;
    if(f.st.burn){ f.hp = Math.max(0, f.hp - f.st.burn); fx('dmg', f, `-${f.st.burn}🔥`); f.st.burn = Math.max(0, f.st.burn - 1) || undefined; }
    if(f.st.poison){ f.hp = Math.max(0, f.hp - f.st.poison); fx('dmg', f, `-${f.st.poison}☠`); f.st.poison = Math.max(0, f.st.poison - 1) || undefined; }
    if(f.st.fear){ f.st.fear--; if(!f.st.fear) delete f.st.fear; }
    if(f.st.stunImmune && !f.st.stun){ f.st.stunImmune--; if(!f.st.stunImmune) delete f.st.stunImmune; }
  });
  ['chill','soak'].forEach(k => { if(me.st[k]){ me.st[k]--; if(!me.st[k]) delete me.st[k]; } });
  delete me.st.thorns;
  const regen = 2 - (me.st.chill ? 1 : 0) + (me.st.heatNext || 0); delete me.st.heatNext;
  me.heat = Math.min(10, me.heat + regen);
  me.st.block = 0;
  B.turn++;
  if(!alive(B).length) return endBattle(B, 'win');
  if(B.dawn){
    B.dawn--;
    if(B.dawn <= 0){ S.flags.dawned = true; B.log = 'The sun comes up over the mountains.'; render(); await sleep(700); return endBattle(B, 'win'); }
  }
  pickIntents(B);
  if(B.tgt < 0 || B.foes[B.tgt].hp <= 0) B.tgt = B.foes.findIndex(f => f.hp > 0);
  B.busy = false;
  render();
}

function endBattle(B, result){
  const rewards = [];
  if(result === 'win'){
    const silver = B.foes.reduce((a, f) => a + (ENEMIES[f.key].silver || 0), 0);
    if(silver){ S.gold += silver; rewards.push({ t:`Hoard +${silver} (Quench silver)`, c:'gold' }); }
    if(B.enc === 'wolves' || B.enc === 'pack') S.hunted = S.season;
  }
  if(result === 'lose') S.hp = Math.max(1, Math.round(S.maxHp * .15));
  S.battle = null;
  const next = result === 'win' ? B.win : result === 'fled' ? null : (B.lose || 'defeat');
  if(!next){ goMap(); return; }
  S.pendingFx = rewards;
  openScene(next);
}
