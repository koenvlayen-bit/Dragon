/* ═══════════ VISUALS: art fallbacks, ambient motion, video ═══════════ */
// New scene art falls back to the nearest existing painting until it is uploaded
const ART_FALLBACK = { C01:'A1',C01b:'A1',C02:'A1',C03:'A1',C04:'A8',C05:'A1',C06:'A5',C08:'A5',C09:'A5',C10:'A4',C11:'A4',C12:'A4',C13:'A4',C14:'A8',C15:'A8',C16:'A6',C17:'A7',C18:'A9',C19:'A9',C20:'A9',C21:'A4',C22:'A4',C23:'A7',C24:'A4',C25:'A3',C26:'A3',C27:'A4',C28:'A8',C29:'A8',C30:'A8',C31:'A7' };
// Codes that have a looping video clip (art/<code>.mp4)
const ART_VIDEO = new Set(['C01','C01b']);
// Ambient motion per painting
const AMBIENT = {
  A1:'steam embers', A2:'', A3:'embers glow', A4:'snow', A5:'embers', A6:'snow', A7:'snow', A8:'snow', A9:'mist', A10:'snow embers', A11:'snow',
  A12:'', A13:'dust', A14:'dust', A15:'dust glow', A16:'dust', A17:'mist',
  C01:'', C01b:'', C02:'steam snow', C03:'snow', C04:'snow', C05:'steam', C06:'snow embers', C08:'embers glow', C09:'snow', C10:'snow',
  C11:'snow', C12:'fire', C13:'snow', C14:'snow', C15:'snow', C16:'embers glow', C17:'ash', C18:'snow', C19:'steam', C20:'mist', C21:'snow',
  C22:'embers', C23:'snow', C24:'steam', C25:'', C26:'ash', C27:'snow', C28:'snow', C29:'glow', C30:'', C31:'snow',
};
function artImg(code, cls){
  const fb = ART_FALLBACK[code];
  const onerr = fb ? `this.onerror=null;this.src='${ART.bg(fb)}'` : 'this.remove()';
  if(ART_VIDEO.has(code)) return `<video class="${cls}" src="art/${code}.mp4?v=${ART_V}" poster="${ART.bg(code)}" autoplay muted loop playsinline></video>`;
  return `<img class="${cls}" src="${ART.bg(code)}" alt="" onerror="${onerr}">`;
}

/* One shared particle loop for every [data-fx] element on screen */
let ambientRAF = 0;
function startAmbient(){
  cancelAnimationFrame(ambientRAF);
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hosts = [...document.querySelectorAll('[data-fx]')].filter(h => h.dataset.fx);
  if(!hosts.length) return;
  const layers = hosts.map(h => {
    let cv = h.querySelector(':scope > canvas.amb');
    if(!cv){ cv = document.createElement('canvas'); cv.className = 'amb'; h.appendChild(cv); }
    const r = h.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
    cv.width = r.width * d; cv.height = r.height * d;
    const x = cv.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0);
    const kinds = h.dataset.fx.split(' '), W = r.width, H = r.height, P = [];
    const spawn = (k, init) => {
      const p = { k, x: Math.random() * W, y: init ? Math.random() * H : 0, t: Math.random() * 6 };
      if(k === 'snow'){ p.y = init ? p.y : -5; p.r = Math.random() * 1.8 + .6; p.vy = Math.random() * .5 + .25; p.vx = Math.random() * .3 - .15; p.a = Math.random() * .5 + .4; }
      if(k === 'ash'){ p.y = init ? p.y : -5; p.r = Math.random() * 1.6 + .8; p.vy = Math.random() * .3 + .12; p.vx = Math.random() * .4 - .2; p.a = Math.random() * .4 + .25; }
      if(k === 'embers' || k === 'fire'){ p.y = init ? p.y : H + 5; p.r = Math.random() * 1.6 + .5; p.vy = -(Math.random() * .7 + .3) * (k === 'fire' ? 1.8 : 1); p.vx = Math.random() * .4 - .2; p.a = Math.random() * .6 + .4; if(k === 'fire') p.x = W * (.3 + Math.random() * .4); }
      if(k === 'steam' || k === 'mist'){ p.y = init ? p.y : H + 20; p.r = Math.random() * 30 + 20; p.vy = -(Math.random() * .25 + .08) * (k === 'mist' ? .3 : 1); p.vx = Math.random() * .2 - .1; p.a = Math.random() * .06 + .03; if(k === 'mist') p.y = init ? H * (.5 + Math.random() * .5) : H + 20; }
      if(k === 'dust'){ p.r = Math.random() * 1.2 + .4; p.vy = Math.random() * .1 - .05; p.vx = Math.random() * .16 + .04; p.a = Math.random() * .3 + .15; }
      return p;
    };
    const count = { snow:60, ash:40, embers:28, fire:60, steam:10, mist:8, dust:30 };
    kinds.forEach(k => { if(k === 'glow') return; for(let i = 0; i < (count[k] || 0); i++) P.push(spawn(k, true)); });
    return { x, W, H, P, spawn, glow: kinds.includes('glow') || kinds.includes('fire'), fire: kinds.includes('fire'), host: h };
  });
  let t0 = performance.now();
  const tick = (now) => {
    const live = layers.filter(L => document.body.contains(L.host));
    if(!live.length) return;
    const tt = (now - t0) / 1000;
    live.forEach(L => {
      const { x, W, H, P } = L;
      x.clearRect(0, 0, W, H);
      if(L.glow){
        const fl = L.fire ? .55 + Math.sin(tt * 9) * .08 + Math.sin(tt * 23) * .05 : .25 + Math.sin(tt * 1.6) * .08;
        const g = x.createRadialGradient(W / 2, H * (L.fire ? .7 : .75), 0, W / 2, H * .7, W * (L.fire ? .55 : .6));
        g.addColorStop(0, `rgba(255,150,60,${fl * .5})`); g.addColorStop(1, 'rgba(255,120,40,0)');
        x.fillStyle = g; x.fillRect(0, 0, W, H);
      }
      P.forEach((p, i) => {
        p.t += .02; p.x += p.vx + Math.sin(p.t) * (p.k === 'snow' || p.k === 'ash' ? .25 : .15); p.y += p.vy;
        if(p.k === 'steam' || p.k === 'mist'){
          const g = x.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r); g.addColorStop(0, `rgba(230,240,248,${p.a})`); g.addColorStop(1, 'rgba(230,240,248,0)');
          x.fillStyle = g; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7); x.fill();
        } else {
          const col = p.k === 'snow' ? '240,248,255' : p.k === 'ash' ? '170,165,160' : p.k === 'dust' ? '255,220,150' : `255,${120 + (p.r * 40 | 0)},60`;
          const fade = (p.k === 'embers' || p.k === 'fire') ? Math.max(0, Math.min(1, p.y / (H * .7))) : 1;
          x.fillStyle = `rgba(${col},${p.a * fade})`; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7); x.fill();
        }
        if(p.y < -40 || p.y > H + 40 || p.x < -40 || p.x > W + 40) P[i] = L.spawn(p.k, false);
      });
    });
    ambientRAF = requestAnimationFrame(tick);
  };
  ambientRAF = requestAnimationFrame(tick);
}

/* Breath beam from the dragon's mouth to a target */
function beam(target){
  const arena = document.getElementById('arena'), me = document.getElementById('me'); if(!arena || !me) return;
  const ar = arena.getBoundingClientRect(), mr = me.getBoundingClientRect();
  const sx = mr.left - ar.left + mr.width * .93, sy = mr.top - ar.top + mr.height * .58;
  let tx = ar.width * .75, ty = ar.height * .45;
  if(target){ const el = document.getElementById('foe-' + target.i); if(el){ const r = el.getBoundingClientRect(); tx = r.left - ar.left + r.width / 2; ty = r.top - ar.top + r.height / 2; } }
  const len = Math.hypot(tx - sx, ty - sy), ang = Math.atan2(ty - sy, tx - sx) * 180 / Math.PI;
  const col = { fire:'255,140,50', shadow:'140,90,200', gold:'255,210,90', fluid:'210,240,255' }[S.look.element];
  const b = document.createElement('div'); b.className = 'beam';
  b.style.cssText = `left:${sx}px;top:${sy}px;width:${len}px;transform:rotate(${ang}deg);background:linear-gradient(90deg,rgba(${col},.95),rgba(${col},.6) 70%,rgba(${col},0))`;
  arena.appendChild(b); setTimeout(() => b.remove(), 620);
}
function flash(){ const a = document.getElementById('arena'); if(!a) return; const f = document.createElement('div'); f.className = 'flash'; a.appendChild(f); setTimeout(() => f.remove(), 400); }
