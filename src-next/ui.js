/* ═══════════ UI ═══════════ */
const $app = () => document.getElementById('app');
const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
const tx = (t) => esc(t).replace(/\{name\}/g, esc(S.name || 'dragon'));

const SIL2 = {
  wolf: `<svg viewBox="0 0 200 130"><defs><linearGradient id="wfg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe3ef"/><stop offset="1" stop-color="#4a5f6e"/></linearGradient></defs><path d="M10 100 L30 72 L62 60 L120 58 L148 40 L160 18 L169 37 L188 43 L178 57 L160 66 L158 96 L148 122 L137 122 L141 96 L120 84 L82 86 L66 122 L54 122 L57 92 L40 96 L26 122 L14 122 Z" fill="url(#wfg)" stroke="#e8f4ff" stroke-opacity=".5" stroke-width="1.5"/><circle cx="171" cy="45" r="2.6" fill="#8fe0ff"/></svg>`,
  warden: `<svg viewBox="0 0 200 210"><defs><linearGradient id="wdg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a7480"/><stop offset="1" stop-color="#1a1e24"/></linearGradient><radialGradient id="wdh"><stop offset="0" stop-color="#bfe8ff"/><stop offset="1" stop-color="#bfe8ff" stop-opacity="0"/></radialGradient></defs><path d="M72 24 C86 6 114 6 128 24 L138 64 L162 206 L38 206 L62 64 Z" fill="url(#wdg)" stroke="#c9d6e0" stroke-opacity=".45" stroke-width="2"/><path d="M80 30 C90 18 110 18 120 30 L116 58 L84 58 Z" fill="#0c0e12"/><path d="M60 90 L40 130 M140 90 L160 130" stroke="#8a929c" stroke-width="5" stroke-dasharray="6 4"/><circle cx="160" cy="134" r="16" fill="url(#wdh)"/></svg>`,
};
function silFor(k){ return SIL2[k] || SIL[k] || SIL.knight; }

function portrait(code){
  const p = PEOPLE[code]; if(!p) return '';
  return `<div class="who"><div class="portrait" style="position:relative"><span>${p.mono}</span><img src="${ART.bg(p.img || code)}" alt="" style="position:absolute;inset:0" onerror="this.remove()"></div><div class="who-name">${esc(p.name)}</div></div>`;
}
function plate(bg, who, place, cls = 'plate'){
  return `<div class="${cls}"><div class="bg" style="background:${BG_FALLBACK[bg] || BG_FALLBACK.A3}"></div><img class="bgimg" src="${ART.bg(bg)}" alt="" onerror="this.remove()">${who ? portrait(who) : ''}${place ? `<div class="place">${esc(place)}</div>` : ''}</div>`;
}
function fxChips(list){ return list && list.length ? `<div class="fx">${list.map(f => `<span class="${f.c}">${esc(f.t)}</span>`).join('')}</div>` : ''; }

/* ── top bar ── */
function topbar(){
  if(!S.name) return '';
  const se = SEASONS[Math.min(S.season, 3)], fl = se.flights;
  const pips = Array.from({ length: fl }, (_, i) => `<i class="${i < S.flights ? 'on' : ''}"></i>`).join('');
  return `<div class="bar">
    <div class="bar-top"><span class="bar-name">${esc(S.name)} · ${STAGES[S.stage]}</span><span class="bar-season">${se.name}<span class="pips" title="Flights left">${pips}</span></span></div>
    <div class="bar-stats"><span class="hpbar" title="Health"><i style="width:${Math.round(S.hp / S.maxHp * 100)}%"></i></span><span class="stat"><b>${S.hp}</b>/${S.maxHp}</span><span class="stat gold">◆ <b>${S.gold}</b></span><span class="stat glow" title="Warmth range">☀ <b>${glowLevel()}</b></span></div>
  </div>`;
}

/* ── screens ── */
function vTitle(){
  const has = !!load();
  return `<div class="title fade-in">
    <img class="egg" src="../art/egg.webp" alt="">
    <div><h1>Eternal Hoard</h1><div class="sub" style="margin-top:10px">The Last Warmth</div></div>
    <div class="stack">
      ${has ? `<button class="btn primary" data-a="continue">Continue</button>` : ''}
      <button class="btn ${has ? '' : 'primary'}" data-a="new">${has ? 'New saga' : 'Begin'}</button>
      <button class="btn ghost" data-a="feats">Feats ${Object.keys(META.ach).length}/${ACH.length}</button>
    </div>
    ${UI.feats ? `<div class="stack" style="text-align:left">${ACH.map(a => `<div class="line ${META.ach[a.id] ? 'good' : ''}"><span><b style="font-family:var(--f-d)">${a.t}</b><br><span class="muted small">${a.d}</span></span><b>${META.ach[a.id] ? '✓' : ''}</b></div>`).join('')}</div>` : ''}
    <p class="note">Chapters one and two · early preview<br><a href="../" style="color:var(--dim)">Play the original saga</a></p>
  </div>`;
}

function vCreate(){
  const L = S.look, O = LOOK_OPTS;
  const grp = (key, label, render) => `<div class="opt-group" data-g="${key}"><div class="label">${label}</div><div class="opts">${O[key].map(o => `<button class="opt ${L[key] === o.id ? 'on' : ''}" data-a="look" data-k="${key}" data-v="${o.id}">${render(o)}</button>`).join('')}</div></div>`;
  return `<div class="create fade-in">
    <h2 style="color:var(--gold-hi);text-align:center;margin-top:8px">What hatches?</h2>
    <div class="hero"><img src="${ART.dragon(L)}" alt=""></div>
    ${grp('color', 'Scales', o => `<div class="sw" style="background:${o.sw}"></div>${o.name}`)}
    ${grp('horns', 'Horns', o => o.name)}
    ${grp('hide', 'Hide · your guard', o => `${o.name}<small>${o.d}</small>`)}
    ${grp('tail', 'Tail · your strike', o => `${o.name}<small>${o.d}</small>`)}
    ${grp('element', 'Breath', o => `${o.name}<small>${o.d}</small>`)}
    <div class="kit"><div><b>${BREATH[L.element].name}</b>${BREATH[L.element].d}</div><div><b>${TAIL[L.tail].name}</b>${TAIL[L.tail].d}</div><div><b>${GUARD[L.hide].name}</b>${GUARD[L.hide].d}</div><div><b>Claw · Roar</b>Always yours</div></div>
    <div class="opt-group" data-g="name"><div class="label">Name</div><input id="name-in" class="name-in" maxlength="20" placeholder="Your dragon's name" value="${esc(UI.nameDraft || '')}" autocomplete="off"></div>
    <div class="presets">${NAME_PRESETS.map(n => `<button data-a="preset" data-v="${n}">${n}</button>`).join('')}</div>
    <button class="btn primary" data-a="hatch">Hatch</button>
  </div>`;
}

function vScene(){
  const sc = SCENES[S.scene]; if(!sc) return '<p>Missing scene.</p>';
  const text = R(sc.text);
  const pend = S.pendingFx; S.pendingFx = null;
  return `<div class="scene fade-in">
    ${plate(sc.bg, sc.who, sc.place)}
    <h2>${tx(R(sc.title))}</h2>
    ${fxChips(pend)}
    <div class="prose">${text.map(p => `<p class="${p.startsWith('"') ? 'say' : ''}">${tx(p)}</p>`).join('')}</div>
    <div class="choices">${sc.choices.map((c, i) => {
      const locked = c.req && !c.req(S);
      return `<button class="choice ${c.fight ? 'fight' : ''} ${locked ? 'locked' : ''}" data-a="choose" data-i="${i}" ${locked ? 'disabled' : ''}><span class="t">${tx(c.t)}</span>${c.h ? `<span class="h">${tx(c.h)}</span>` : ''}</button>`;
    }).join('')}</div>
  </div>`;
}
function vOut(){
  const sc = SCENES[S.scene], o = S.out;
  return `<div class="scene fade-in">
    ${plate(sc.bg, sc.who, sc.place)}
    <h2>${tx(R(sc.title))}</h2>
    <div class="prose">${o.text.map(p => `<p class="${p.startsWith('"') ? 'say' : ''}">${tx(p)}</p>`).join('')}</div>
    ${fxChips(o.fx)}
    <button class="btn primary" data-a="outnext">Continue</button>
  </div>`;
}

/* map */
const MAP_SVG = `<svg class="base" viewBox="0 0 300 200" preserveAspectRatio="none"><defs><radialGradient id="mg" cx="50%" cy="60%" r="70%"><stop offset="0" stop-color="#1d2e3a"/><stop offset="1" stop-color="#0b141b"/></radialGradient><symbol id="mp" viewBox="0 0 30 20"><path d="M1 19 L11 3 L16 10 L20 5 L29 19Z" fill="#9fb8c8" fill-opacity=".25" stroke="#cfe3ef" stroke-opacity=".6" stroke-width="1"/><path d="M11 3 L13.5 7 L11 6 L9 8Z" fill="#eef6fb"/></symbol><symbol id="tr" viewBox="0 0 10 14"><path d="M5 1 L9 12 L1 12Z" fill="#1d3a34" stroke="#5f8a80" stroke-opacity=".6" stroke-width=".6"/></symbol></defs>
<rect width="300" height="200" fill="url(#mg)"/>
<g>${[[40,45],[56,38],[72,46],[100,40],[118,34],[200,40],[216,32],[232,42],[248,36],[264,46]].map(([x,y]) => `<use href="#mp" x="${x}" y="${y}" width="30" height="20"/>`).join('')}</g>
<g>${[[78,54],[84,62],[92,56],[70,66],[98,64],[20,120],[28,128],[14,134],[36,140],[200,150],[210,160],[190,166],[240,120],[250,130]].map(([x,y]) => `<use href="#tr" x="${x}" y="${y}" width="8" height="11"/>`).join('')}</g>
<path d="M136 120 L148 98 L156 98 L168 120Z" fill="#3a2a24" stroke="#e4682f" stroke-opacity=".7" stroke-width="1"/>
<path d="M156 58 C140 76 128 88 126 104 C124 124 140 150 170 162 C196 172 214 176 230 200" fill="none" stroke="#9fd0ee" stroke-opacity=".55" stroke-width="2.2"/>
<path d="M0 30 C60 24 120 20 180 22 C230 24 270 18 300 14" fill="none" stroke="#cfe3ef" stroke-opacity=".15" stroke-width="1" stroke-dasharray="3 4"/>
</svg>`;
function vMap(){
  const sel = S.sel || 'kettle', P = PLACES[sel];
  const pins = Object.entries(PLACES).filter(([id, p]) => !p.ch || p.ch <= (S.chapter || 1)).map(([id, p]) => {
    const st = placeState(id), ev = eventAt(id);
    const cls = [id === 'lair' ? 'lair' : '', st === 'warm' || st === 'kindled' || st === 'saved' ? 'warm' : '', st === 'lost' ? 'lost' : '', st === 'locked' ? 'locked' : '', ev && S.flights > 0 ? 'event' : '', id === sel ? 'sel' : ''].join(' ');
    return `<button class="pin ${cls}" style="left:${p.x}%;top:${p.y}%" data-a="sel" data-v="${id}" aria-label="${esc(p.name)}"><span class="dot">${p.icon}</span><span class="nm">${esc(p.name)}</span>${ev && S.flights > 0 ? '<span class="ex"></span>' : ''}</button>`;
  }).join('');
  const st = placeState(sel), ev = eventAt(sel);
  const tagTxt = { warm:'Warm', kindled:'Kindled', saved:'Saved', frozen:'Frozen', lost:'Lost', locked:'Chapter 2' }[st];
  const tagCls = { warm:'warm', kindled:'warm', saved:'warm', frozen:'frozen', lost:'lost', locked:'frozen' }[st];
  let extra = '';
  if(sel === 'warren' && S.flags.goblins) extra = `<span class="tag ally">${{ allied:'Allies', vassal:'Vassals', terrified:'Terrified' }[S.flags.goblins]}</span>`;
  let info;
  if(sel === 'lair'){
    info = `<p class="muted small">Your hoard is your hearth. The more gold you sleep on, the further your warmth reaches. Warmth range is ${glowLevel()} now.</p><button class="btn primary" data-a="lair">Enter your lair</button>`;
  } else {
    const d = Math.round(dist(P, LAIR));
    info = `<p class="muted small">${esc(P.blurb || '')}</p>
      ${P.kind === 'village' && st === 'frozen' ? `<p class="small" style="color:var(--frost)">Outside your warmth (distance ${d}, your range ${glowLevel()}). Kindle it, or grow your hoard, before winter.</p>` : ''}
      <p class="small" style="color:${ev ? 'var(--gold-hi)' : 'var(--faint)'}">${ev ? '✦ ' + esc(ev.label) : 'Nothing calls you here this season.'}</p>
      <button class="btn primary" data-a="fly" data-v="${sel}" ${ev && S.flights > 0 ? '' : 'disabled'}>Fly here · 1 flight</button>`;
  }
  const m = (label, v, col) => `<div class="meter"><span class="label">${label}</span><b>${v}</b><span class="mv"><i style="width:${v}%;background:${col}"></i></span></div>`;
  return `<div class="mapview fade-in">
    <div class="mapbox" id="mapbox">${MAP_SVG}<img class="base" src="${ART.bg('A2')}" alt="" onerror="this.remove()" style="object-fit:cover"><canvas id="frost"></canvas>${pins}</div>
    <div class="mapinfo"><h3>${esc(P.name)}<span style="display:flex;gap:6px">${extra}<span class="tag ${tagCls}">${tagTxt}</span></span></h3>${info}</div>
    <div class="meters">${m('Hope', S.hope, 'var(--hope)')}${m('Dread', S.dread, 'var(--dread)')}${m('Wildness', S.wild, 'var(--wild)')}</div>
    <button class="btn ghost" data-a="endseason">${UI.confirmEnd ? 'Tap again: let the season turn' : S.flights > 0 ? `Let the season turn (${S.flights} flight${S.flights > 1 ? 's' : ''} unused)` : 'Let the season turn'}</button>
    ${(S.chapter || 1) >= 2 ? `<p class="hint">${S.season < 2 ? `${2 - S.season} season${2 - S.season > 1 ? 's' : ''} until the Grey Hold opens.` : 'The Grey Hold is open. The bell is ringing.'}</p>` : S.season < 3 ? `<p class="hint">${3 - S.season} season${3 - S.season > 1 ? 's' : ''} until winter. Villages outside your warmth when it comes will be lost.</p>` : ''}
  </div>`;
}

let frostTex = null, shownR = null;
function drawFrost(){
  const box = document.getElementById('mapbox'), cv = document.getElementById('frost'); if(!box || !cv) return;
  const W = box.clientWidth, H = box.clientHeight, dpr = Math.min(2, devicePixelRatio || 1);
  cv.width = W * dpr; cv.height = H * dpr;
  const x = cv.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
  if(!frostTex){
    frostTex = document.createElement('canvas'); frostTex.width = 256; frostTex.height = 256;
    const t = frostTex.getContext('2d');
    t.fillStyle = 'rgba(40,70,96,.46)'; t.fillRect(0, 0, 256, 256);
    for(let i = 0; i < 900; i++){ t.fillStyle = `rgba(225,242,255,${Math.random() * .4})`; const r = Math.random() * 1.6; t.beginPath(); t.arc(Math.random() * 256, Math.random() * 256, r, 0, 7); t.fill(); }
    t.strokeStyle = 'rgba(240,250,255,.18)'; t.lineWidth = .7;
    for(let i = 0; i < 40; i++){ const cx = Math.random() * 256, cy = Math.random() * 256; for(let k = 0; k < 6; k++){ const a = k * Math.PI / 3; t.beginPath(); t.moveTo(cx, cy); t.lineTo(cx + Math.cos(a) * 6, cy + Math.sin(a) * 6); t.stroke(); } }
  }
  const target = radius();
  if(shownR === null) shownR = target;
  const paint = (r) => {
    x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, W, H);
    x.fillStyle = x.createPattern(frostTex, 'repeat'); x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'destination-out';
    const hole = (px, py, rr) => { const g = x.createRadialGradient(px, py, rr * .55, px, py, rr); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.beginPath(); x.arc(px, py, rr, 0, 7); x.fill(); };
    hole(LAIR.x / 100 * W, LAIR.y / 100 * H, r / 100 * W * 1.12);
    VILLAGES.forEach(v => { if(S.places[v] === 'kindled' || S.places[v] === 'saved') hole(PLACES[v].x / 100 * W, PLACES[v].y / 100 * H, 9 / 100 * W); });
    hole(PLACES.warren.x / 100 * W, PLACES.warren.y / 100 * H, 6 / 100 * W);
    x.globalCompositeOperation = 'source-over';
    const g = x.createRadialGradient(LAIR.x / 100 * W, LAIR.y / 100 * H, 0, LAIR.x / 100 * W, LAIR.y / 100 * H, r / 100 * W);
    g.addColorStop(0, 'rgba(228,104,47,.30)'); g.addColorStop(1, 'rgba(228,104,47,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  };
  if(Math.abs(shownR - target) < .3 || matchMedia('(prefers-reduced-motion: reduce)').matches){ shownR = target; paint(target); return; }
  const from = shownR, t0 = performance.now();
  const step = (now) => { const k = Math.min(1, (now - t0) / 1400), e = 1 - Math.pow(1 - k, 3); shownR = from + (target - from) * e; paint(shownR); if(k < 1 && document.getElementById('frost') === cv) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

function vLair(){
  const restHeal = S.upgrades.pool ? S.maxHp - S.hp : Math.min(S.maxHp - S.hp, Math.round(S.maxHp * .5));
  return `<div class="lair fade-in">
    ${plate('A3', null, 'Your lair')}
    <div class="hoardbox"><div class="big g"><div class="label">Hoard</div><div class="n">◆ ${S.gold}</div></div><div class="big w"><div class="label">Warmth range</div><div class="n">☀ ${glowLevel()}</div></div></div>
    <p class="muted small" style="margin:0">Every 12 gold in your hoard pushes your warmth one step further (up to 16). Upgrades cost gold, but their warmth is permanent.</p>
    ${UPGRADES.map(u => {
      const lvl = S.upgrades[u.id], maxed = lvl >= u.max, cost = u.cost[lvl], ok = !maxed && S.gold >= cost && (!u.req || u.req(S));
      return `<div class="upg"><h4>${u.name} ${u.max > 1 ? `<span class="lvl">${lvl}/${u.max}</span>` : ''}</h4><p>${esc(u.d(lvl))}${u.req && !u.req(S) ? `<br><i>${u.reqText}</i>` : ''}</p><button class="buy" data-a="buy" data-v="${u.id}" ${ok ? '' : 'disabled'}>${maxed ? 'Built' : `◆ ${cost}`}</button></div>`;
    }).join('')}
    <button class="btn frost" data-a="rest" ${S.flights > 0 && S.hp < S.maxHp ? '' : 'disabled'}>Sleep on your hoard · ${restHeal > 0 ? `+${restHeal} health · ` : ''}1 flight</button>
    <button class="btn" data-a="map">Back to the map</button>
  </div>`;
}

function vBattle(){
  const B = S.battle; const me = B.me;
  const foes = B.foes.map((f, i) => {
    const iv = f.hp > 0 ? intentView(f) : null;
    const chips = Object.entries(f.st).filter(([k, v]) => v && k !== 'stunImmune').map(([k, v]) => `<span class="chip ${k}">${{ burn:'🔥', poison:'☠', blind:'◌', fear:'✖', stun:'✷', block:'⛨', fury:'▲' }[k] || ''}${v}</span>`).join('');
    return `<div class="foe ${i === B.tgt ? 'tgt' : ''} ${f.hp <= 0 ? 'dead' : ''}" id="foe-${i}" data-a="tgt" data-i="${i}">
      ${iv ? `<span class="intent ${iv.c}">${iv.t}</span>` : ''}
      <div class="fig"><img src="${ART.bg(f.art)}" alt="" onerror="this.nextElementSibling.style.display='block';this.remove()"><div style="display:none;width:100%;height:100%">${silFor(f.sil)}</div></div>
      <span class="fname">${esc(f.name)} · ${f.hp}/${f.max}</span>
      <span class="fhp"><i style="width:${f.hp / f.max * 100}%"></i></span>
      <span class="chips">${chips}</span>
    </div>`;
  }).join('');
  const mchips = Object.entries(me.st).filter(([k, v]) => v).map(([k, v]) => `<span class="chip ${k}">${{ block:'⛨ ', chill:'❄ Chilled ', soak:'💧 Soaked ', stun:'⛓ Chained', evade:'≋ Dodge', thorns:'✶ Thorns ', heatNext:'+heat ' }[k] || k}${k === 'stun' || k === 'evade' ? '' : v}</span>`).join('');
  const acts = actions(B);
  return `<div class="battle">
    <div class="arena" id="arena"><div style="position:absolute;inset:0;background:${BG_FALLBACK[B.bg]}"></div><img class="bgimg" src="${ART.bg(B.bg)}" alt="" onerror="this.remove()">
      ${B.dawn ? `<div class="dawn">☀ Dawn in ${B.dawn} turn${B.dawn > 1 ? 's' : ''}</div>` : ''}
      <div class="me" id="me"><img src="${ART.dragon(S.look)}" alt=""></div>
      <div class="foes n${B.foes.length}">${foes}</div>
    </div>
    <div class="mestat"><div class="row1"><span class="hpbar"><i style="width:${S.hp / S.maxHp * 100}%"></i></span><span class="stat"><b>${S.hp}</b>/${S.maxHp}</span></div>
      <div class="row1"><span class="label">Heat</span><span class="heat">${Array.from({ length:10 }, (_, i) => `<i class="${i < me.heat ? 'on' : ''}"></i>`).join('')}</span><span class="chips" style="justify-content:flex-start">${mchips}</span></div></div>
    <div class="blog">${esc(B.log)}</div>
    ${me.st.stun ? `<button class="btn frost" data-a="act" data-v="struggle" ${B.busy ? 'disabled' : ''}>Struggle against the chains</button>` :
    `<div class="acts">${acts.map(a => `<button class="act ${a.cls || ''}" data-a="act" data-v="${a.id}" ${B.busy || me.heat < a.cost ? 'disabled' : ''}><span class="an">${esc(a.name)}</span><span class="ad">${esc(a.d)}</span>${a.cost ? `<span class="cost">🔥${a.cost}</span>` : ''}</button>`).join('')}</div>`}
    ${B.foes.length > 1 ? '<p class="hint">Tap an enemy to target it.</p>' : ''}
  </div>`;
}

function vReport(){
  const r = S.report;
  return `<div class="summary fade-in">
    <div class="label">${esc(r.from)} ends</div>
    <h2>${r.villages.length ? 'The frost returns' : 'The season turns'}</h2>
    ${r.villages.length ? `<div class="lines">${r.villages.map(v => `<div class="line ${v.ok ? 'good' : 'bad'}"><span>${PLACES[v.v].name}</span><b>${v.ok ? 'Survives the winter' : 'Lost to the frost'}</b></div>`).join('')}</div>` : ''}
    <div class="lines">${r.lines.map(l => `<div class="line ${l.good ? 'good' : 'bad'}"><span>${esc(l.t)}</span><b>${esc(l.v)}</b></div>`).join('') || '<div class="line"><span>A quiet season.</span><b></b></div>'}</div>
    <button class="btn primary" data-a="nextseason">${SEASONS[S.season] ? SEASONS[S.season].name : 'Continue'}</button>
  </div>`;
}

function vEnd(){
  const ch2 = (S.chapter || 1) >= 2;
  const saved = VILLAGES.filter(v => S.places[v] === 'saved' || S.places[v] === 'kindled');
  const got = ACH.filter(a => META.ach[a.id]);
  const line = (k, v, good) => `<div class="line ${good ? 'good' : ''}"><span>${k}</span><b>${v}</b></div>`;
  const lines = ch2 ? [
    line('Vexar', { freed:'Freed, your brother', fled:'Fled north, still chained' }[S.flags.vexar] || 'Unknown', S.flags.vexar === 'freed'),
    line('Ysolde Marr', { spared:'Spared', exiled:'Exiled north', burned:'Burned with her tower' }[S.flags.ysolde] || 'Unknown'),
    line('Lord Harrow', { pact:'Took his gold', burned:'Burned his ice', warned:'Warned him' }[S.flags.harrow] || 'Never met'),
    line('Villages warm', `${saved.length}/3`, saved.length === 3),
    line('Hoard', `◆ ${S.gold}`),
    line('Hope · Dread · Wildness', `${S.hope} · ${S.dread} · ${S.wild}`),
  ] : [
    line('Villages saved', `${saved.length}/3 ${saved.length ? '· ' + saved.map(v => PLACES[v].name).join(', ') : ''}`, saved.length === 3),
    line('Hoard', `◆ ${S.gold}`),
    line('Hope · Dread · Wildness', `${S.hope} · ${S.dread} · ${S.wild}`),
    line('The Grinder', S.flags.dawned ? 'Turned to stone' : S.done.grinder ? 'Defeated' : 'Survived'),
    line('Aurelia', { free:'Walked free', held:'Your guest' }[S.flags.aurelia] || 'Never met'),
  ];
  return `<div class="summary fade-in">
    ${plate('A7', ch2 && S.flags.vexar === 'freed' ? 'V5' : null, ch2 ? 'End of chapter two' : 'End of chapter one')}
    <div class="label">The Last Warmth · Chapter ${ch2 ? 'two' : 'one'}</div>
    <h2>${esc(S.name)}, ${ch2 ? 'who silenced the bell' : STAGES[S.stage].toLowerCase() + ' of the Spring'}</h2>
    <div class="lines">${lines.join('')}</div>
    <div class="label">Feats unlocked · ${got.length}/${ACH.length}</div>
    <div class="stack">${got.map(a => `<div class="ach"><b>${a.t}</b><span class="muted small">${a.d}</span></div>`).join('')}</div>
    ${ch2 ? `<p class="muted">The next campaign, <i>The Gilded Debt</i>, takes you south to Veyrmark and the Ledger that paid for the Quench. It is being written.</p>
      <button class="btn primary" data-a="new">Start a new saga</button>`
    : `<p class="muted">Your choices carry over: the villages you saved, the goblins, Aurelia, Mirelle and the scale.</p>
      <button class="btn primary" data-a="ch2">Continue to chapter two</button>
      <button class="btn" data-a="new">Play chapter one again</button>`}
    <button class="btn ghost" data-a="title">Title screen</button>
  </div>`;
}

/* ── render & effects ── */
const UI = { feats:false, nameDraft:'', confirmEnd:false };
function render(){
  const v = { title:vTitle, create:vCreate, scene:vScene, out:vOut, map:vMap, lair:vLair, battle:vBattle, report:vReport, end:vEnd }[S.screen] || vTitle;
  const showBar = !['title','create','end'].includes(S.screen);
  $app().innerHTML = (showBar ? topbar() : '') + v();
  if(S.screen === 'map') drawFrost();
  if(S.screen !== 'title') save();
  flushToasts();
}
function flushToasts(){
  if(!pendingAch.length || document.querySelector('.toast')) return;
  const a = pendingAch.shift();
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = `Feat unlocked · ${a.t}`;
  document.body.appendChild(el); setTimeout(() => { el.remove(); flushToasts(); }, 2600);
}
function toastText(t){ const el = document.createElement('div'); el.className = 'toast'; el.style.color = 'var(--parch)'; el.textContent = t; document.body.appendChild(el); setTimeout(() => el.remove(), 2400); }
function fx(type, target, text){
  const el = target === 'me' ? document.getElementById('me') : document.getElementById('foe-' + target.i); if(!el) return;
  const r = el.getBoundingClientRect(); const f = document.createElement('div');
  f.className = 'float ' + type; f.textContent = text;
  f.style.left = (r.left + r.width / 2 + (Math.random() * 30 - 15)) + 'px'; f.style.top = (r.top + r.height * .3 + scrollY) + 'px'; f.style.position = 'absolute';
  document.body.appendChild(f); setTimeout(() => f.remove(), 950);
}
function anim(kind, target){
  const arena = document.getElementById('arena'); if(!arena) return;
  const col = { fire:'rgba(255,140,50,.85)', shadow:'rgba(120,70,180,.85)', gold:'rgba(255,210,90,.85)', fluid:'rgba(200,235,255,.85)' }[S.look.element];
  const b = document.createElement('div'); b.className = 'burst';
  let x = '72%', y = '50%';
  if(target){ const el = document.getElementById('foe-' + target.i); if(el){ const ar = arena.getBoundingClientRect(), r = el.getBoundingClientRect(); x = (r.left - ar.left + r.width / 2) + 'px'; y = (r.top - ar.top + r.height / 2) + 'px'; } }
  if(kind === 'roar'){ x = '30%'; y = '62%'; }
  b.style.left = x; b.style.top = y;
  b.style.background = kind === 'claw' ? 'radial-gradient(circle,rgba(255,255,255,.7),transparent 60%)' : kind === 'roar' ? 'radial-gradient(circle,transparent 40%,rgba(255,220,160,.5) 50%,transparent 70%)' : `radial-gradient(circle,${col},transparent 65%)`;
  if(kind === 'breath' && !target){ b.style.width = '300px'; b.style.height = '300px'; }
  setTimeout(() => { const a = document.getElementById('arena'); if(a){ a.appendChild(b); setTimeout(() => b.remove(), 520); } }, 0);
}
function shake(who){ setTimeout(() => { const el = document.getElementById(who === 'me' ? 'me' : 'foe-' + who.i); if(el){ el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); } }, 0); }

/* ── flow ── */
function openScene(id){ S.scene = id; S.out = null; S.screen = 'scene'; render(); scrollTo(0, 0); }
function navigate(go){
  if(!go || go === 'map') return goMap();
  if(go === 'create'){ S.screen = 'create'; render(); return scrollTo(0, 0); }
  if(go === 'end'){ if(!S.chapterDone){ S.chapterDone = true; META.runs++; saveMeta(); } S.screen = 'end'; render(); return scrollTo(0, 0); }
  if(go === 'lair'){ S.screen = 'lair'; return render(); }
  if(SCENES[go]) return openScene(go);
  goMap();
}
function choose(i){
  const sc = SCENES[S.scene], c = sc.choices[i]; if(!c || (c.req && !c.req(S))) return;
  if(c.fight){ startBattle(c.fight.enc, c.fight.win, c.fight.lose); render(); return scrollTo(0, 0); }
  if(c.refund) S.flights = Math.min(SEASONS[S.season].flights, S.flights + 1);
  const shown = applyFx(c.fx);
  if(c.out){ S.out = { text:c.out, fx:shown, go:c.go }; S.screen = 'out'; render(); return scrollTo(0, 0); }
  if(shown.length && (!c.go || c.go === 'map')) setTimeout(() => toastText(shown.map(x => x.t).join(' · ')), 50);
  else if(shown.length) S.pendingFx = shown;
  navigate(c.go);
}
function goMap(){
  if((S.chapter || 1) >= 2){
    if(S.season === 1 && !S.done.siege && S.flights <= 2){ S.done.siege = true; S.flights = Math.max(0, S.flights - 1); return openScene('siege'); }
  } else if(S.season === 2 && !S.done.raid && S.flights <= 2){ S.done.raid = true; S.flights = Math.max(0, S.flights - 1); return openScene('raid'); }
  if(S.flights <= 0) return turnSeason();
  S.screen = 'map'; UI.confirmEnd = false; render();
}
function turnSeason(){
  if((S.chapter || 1) >= 2 && S.season >= 2) return openScene(S.done.hold ? 'ch2end' : 'holdApproach');
  if(S.season >= 3) return openScene(S.done.grinder ? 'ending' : 'grinderAttack');
  S.report = endSeason(); S.screen = 'report'; render(); scrollTo(0, 0);
}
function fly(id){
  const ev = eventAt(id); if(!ev || S.flights <= 0) return;
  S.flights--; openScene(ev.scene);
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-a]'); if(!el || el.disabled) return;
  const a = el.dataset.a, v = el.dataset.v;
  if(a !== 'endseason') UI.confirmEnd = false;
  switch(a){
    case 'ch2': startChapter2(); scrollTo(0, 0); break;
    case 'new': S = freshState(); UI.nameDraft = ''; S.screen = 'scene'; openScene('egg'); break;
    case 'continue': { const l = load(); if(l){ S = l; if(S.screen === 'battle' && !S.battle) S.screen = 'map'; if(S.battle) S.battle.busy = false; render(); } break; }
    case 'title': S.screen = 'title'; render(); break;
    case 'feats': UI.feats = !UI.feats; render(); break;
    case 'look': {
      S.look[el.dataset.k] = v; UI.nameDraft = (document.getElementById('name-in') || {}).value || UI.nameDraft; render();
      const order = ['color','horns','hide','tail','element','name'], nx = order[order.indexOf(el.dataset.k) + 1];
      const g = nx && document.querySelector(`[data-g="${nx}"]`);
      if(g) setTimeout(() => g.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start' }), 60);
      break; }
    case 'preset': { const i = document.getElementById('name-in'); if(i){ i.value = v; UI.nameDraft = v; } break; }
    case 'hatch': { const n = ((document.getElementById('name-in') || {}).value || '').trim() || NAME_PRESETS[Math.floor(Math.random() * NAME_PRESETS.length)]; S.name = n.slice(0, 20); S.hp = S.maxHp = STAGE_HP[0]; openScene('firstWarmth'); break; }
    case 'choose': choose(+el.dataset.i); break;
    case 'outnext': navigate(S.out && S.out.go); break;
    case 'sel': S.sel = v; render(); break;
    case 'fly': fly(v); break;
    case 'lair': S.screen = 'lair'; render(); scrollTo(0, 0); break;
    case 'map': goMap(); break;
    case 'buy': { const u = UPGRADES.find(x => x.id === v), l = S.upgrades[v], c = u.cost[l]; if(l < u.max && S.gold >= c && (!u.req || u.req(S))){ S.gold -= c; S.upgrades[v]++; if(v === 'pool'){ S.maxHp += 15; S.hp += 15; } toastText(`${u.name} built`); render(); } break; }
    case 'rest': if(S.flights > 0){ S.flights--; S.hp = S.upgrades.pool ? S.maxHp : Math.min(S.maxHp, S.hp + Math.round(S.maxHp * .5)); toastText('You sleep on your hoard.'); if(S.flights <= 0) goMap(); else render(); } break;
    case 'endseason': if(!UI.confirmEnd){ UI.confirmEnd = true; render(); } else { UI.confirmEnd = false; S.flights = 0; goMap(); } break;
    case 'nextseason': S.report = null; openScene(((S.chapter || 1) >= 2 ? SEASON_OPEN_2 : { 1:'summer', 2:'ashfall', 3:'winter' })[S.season] || 'ending'); break;
    case 'tgt': if(S.battle && !S.battle.busy){ S.battle.tgt = +el.dataset.i; render(); } break;
    case 'act': if(v === 'struggle') playerAct('struggle'); else playerAct(v); break;
  }
});
document.addEventListener('input', (e) => { if(e.target.id === 'name-in') UI.nameDraft = e.target.value; });
addEventListener('resize', () => { if(S.screen === 'map') drawFrost(); });

/* boot */
(function boot(){ const l = load(); if(l && l.name){ S = l; S.screen = 'title'; } render(); })();
