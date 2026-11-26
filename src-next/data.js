/* ═══════════ DATA: options, art, enemies, places ═══════════ */
const ART_V = '3';
const ART = {
  // backgrounds and portraits arrive as art/<code>.webp; missing files fall back gracefully
  bg: (k) => `art/${k}.webp?v=${ART_V}`,
  dragon: (look, sm) => `../art/d-${look.color}-${look.horns}${sm ? '-sm' : ''}.webp`,
};
const BG_FALLBACK = {
  A1: 'radial-gradient(60% 70% at 50% 75%,rgba(228,104,47,.55),transparent 60%),radial-gradient(80% 60% at 50% 10%,#2b4a5c,transparent 70%),linear-gradient(180deg,#132430,#0a1116)',
  A2: 'linear-gradient(180deg,#16242f,#0a1218)',
  A3: 'radial-gradient(70% 60% at 50% 80%,rgba(228,104,47,.6),transparent 65%),linear-gradient(180deg,#2a1610,#120a08)',
  A4: 'radial-gradient(40% 30% at 30% 70%,rgba(240,160,80,.35),transparent 70%),linear-gradient(180deg,#2a3440,#121a22 70%,#e8f2f8 140%)',
  A5: 'radial-gradient(60% 50% at 50% 70%,rgba(240,140,60,.45),transparent 70%),linear-gradient(180deg,#24190f,#100b07)',
  A6: 'radial-gradient(18% 14% at 55% 60%,rgba(255,170,80,.7),transparent 70%),linear-gradient(180deg,#0e1a2a,#081018)',
  A7: 'linear-gradient(180deg,#3a4652,#1a222a 60%,#0c1014)',
  A8: 'radial-gradient(20% 20% at 78% 18%,rgba(220,235,255,.6),transparent 70%),linear-gradient(180deg,#0f1b2b,#0a1018)',
  A9: 'linear-gradient(180deg,#e8b8c0 0%,#5a6c82 45%,#1a2632)',
};
const PEOPLE = {
  P1:{ name:'Old Gnash', mono:'G' }, P2:{ name:'Snikkit', mono:'S' }, P3:{ name:'Mirelle', mono:'M' },
  P4:{ name:'Aurelia', mono:'A' }, P5:{ name:'Ysolde Marr', mono:'Y' }, V5:{ name:'Vexar', mono:'V', img:'V5p' },
};

const LOOK_OPTS = {
  color: [
    { id:'crimson', name:'Crimson', sw:'#9c2a1c' }, { id:'obsidian', name:'Obsidian', sw:'#1b1a22' },
    { id:'storm-grey', name:'Storm', sw:'#59626e' }, { id:'gold-bronze', name:'Bronze', sw:'#a8742a' },
  ],
  horns: [ { id:'ram', name:'Ram' }, { id:'spike', name:'Spiked' }, { id:'crown', name:'Crown' }, { id:'none', name:'None' } ],
  hide: [
    { id:'armored', name:'Armoured', d:'Guard blocks 12' }, { id:'ridged', name:'Ridged', d:'Guard + thorns' },
    { id:'leathery', name:'Leathery', d:'Guard + heat' }, { id:'strange', name:'Glowing', d:'Guard + cleanse' },
  ],
  tail: [
    { id:'club', name:'Club', d:'Stuns' }, { id:'whip', name:'Whip', d:'Hits 3×' },
    { id:'venom', name:'Venom', d:'Poisons' }, { id:'fin', name:'Fin', d:'Sweeps + dodge' },
  ],
  element: [
    { id:'fire', name:'Fire', d:'Burns' }, { id:'shadow', name:'Shadow', d:'Blinds' },
    { id:'gold', name:'Gold', d:'Hits all + shield' }, { id:'fluid', name:'Steam', d:'Hits all + cleanse' },
  ],
};
const NAME_PRESETS = ['Emberwake','Duskfang','Vaelithra','Korrathis','Nyxaria','Aurumis','Skarnoth','Thalassor','Cinderveil','Hearthmaw'];

const STAGES = ['Hatchling','Whelp','Young dragon'];
const STAGE_HP = [50, 64, 80];
const STAGE_POW = [1, 1.2, 1.4];
const SEASONS = [
  { id:'thaw',   name:'The Thaw',     flights:3 },
  { id:'summer', name:'Short Summer', flights:3 },
  { id:'ashfall',name:'Ashfall',      flights:3 },
  { id:'winter', name:'Long Winter',  flights:2 },
];

/* ── Abilities ── */
const BREATH = {
  fire:   { name:'Dragonfire',      d:'9 damage, burns',             cost:4 },
  shadow: { name:'Black Flame',     d:'8 damage, blinds',            cost:4 },
  gold:   { name:'Gilded Breath',   d:'5 to all, shield 6',          cost:4 },
  fluid:  { name:'Scalding Steam',  d:'6 to all, clears frost',      cost:4 },
};
const TAIL = {
  club:  { name:'Tail Club',   d:'6 damage, stuns',     cost:2 },
  whip:  { name:'Tail Lash',   d:'3 hits of 3',          cost:2 },
  venom: { name:'Venom Barb',  d:'3 damage, poison 4',   cost:2 },
  fin:   { name:'Fin Sweep',   d:'4 to all, dodge next', cost:2 },
};
const GUARD = {
  armored:  { name:'Armoured Scales', d:'Block 12' },
  ridged:   { name:'Bristle',         d:'Block 7, thorns 4' },
  leathery: { name:'Wing Cloak',      d:'Block 7, +2 heat next' },
  strange:  { name:'Glowing Hide',    d:'Block 7, cleanse' },
};

/* ── Enemies ── */
const ENEMIES = {
  pup:    { name:'Frost Wolf',     art:'V3', sil:'wolf',   hp:11, tags:['beast','frost'], moves:['bite','bite','howl'] },
  wolf:   { name:'Frost Wolf',     art:'V3', sil:'wolf',   hp:17, tags:['beast','frost'], moves:['bite','lunge','howl','bite'] },
  knight: { name:'Quench Knight',  art:'V1', sil:'knight', hp:34, tags:['human','quench'], moves:['lance','douse','shield'], silver:22 },
  warden: { name:'Frost Warden',   art:'V2', sil:'warden', hp:26, tags:['human','quench'], moves:['chill','chain','mend'], silver:16 },
  grinder:{ name:'The Grinder',    art:'V4', sil:'troll',  hp:92, tags:['frost','boss'], moves:['windup','smash','grab','rime'] },
};
const MOVES = {
  bite:   { k:'atk', dmg:5,  t:'bites' },
  lunge:  { k:'atk', dmg:8,  t:'lunges' },
  howl:   { k:'spc', t:'howls', label:'Howl' },
  lance:  { k:'atk', dmg:9,  t:'drives the lance' },
  douse:  { k:'spc', dmg:3,  t:'douses you', label:'Douse' },
  shield: { k:'def', blk:10, t:'raises a shield', label:'Shield' },
  chill:  { k:'spc', dmg:2,  t:'breathes frost', label:'Chill' },
  chain:  { k:'spc', dmg:4,  t:'casts iron chains', label:'Chain' },
  mend:   { k:'spc', t:'mends', label:'Mend' },
  bolt:   { k:'atk', dmg:7,  t:'hurls a frost bolt' },
  windup: { k:'wind', t:'raises the club', label:'Winding up' },
  smash:  { k:'atk', dmg:18, t:'SMASHES' },
  grab:   { k:'atk', dmg:8,  t:'grabs and chews', heal:6 },
  rime:   { k:'def', blk:12, t:'grows rime armour', label:'Rime' },
};
const ENCOUNTERS = {
  pup:     { foes:['pup'], bg:'A1', flee:false },
  wolves:  { foes:['wolf','wolf'], bg:'A8', flee:true, meat:true },
  pack:    { foes:['wolf','wolf','wolf'], bg:'A8', flee:true, meat:true },
  patrol:  { foes:['knight'], bg:'A9', flee:false },
  raid:    { foes:['knight','warden'], bg:'A4', flee:false },
  grinder: { foes:['grinder'], bg:'A8', flee:false, dawn:9 },
};

/* ── Map ── */
const LAIR = { x:55, y:70 };
const PLACES = {
  lair:   { name:'The Spring',     x:55, y:70, icon:'♨', kind:'lair' },
  kettle: { name:'Kettle',         x:78, y:69, icon:'⌂', kind:'village', blurb:'Low stone huts around one frozen well, east of your mountain. Forty people, give or take the ones who did not wake up.' },
  warren: { name:'The Warren',     x:64, y:47, icon:'◒', kind:'site',    blurb:'Goblin tunnels under the mountains, warmed by the last of their dying heart.' },
  pines:  { name:'Wolf Pines',     x:38, y:58, icon:'✶', kind:'site',    blurb:'Black pines and white wolves. They have smelled your warmth.' },
  ashby:  { name:'Ashby',          x:34, y:38, icon:'⌂', kind:'village', blurb:'A ferry village at the frozen ford. The ferry has not moved in nine years.' },
  hollin: { name:'Hollin',         x:88, y:24, icon:'⌂', kind:'village', blurb:'Far to the north-east, under the high peaks. Smoke rises from fewer chimneys every week.' },
  hut:    { name:"Mirelle's Hut",  x:10, y:64, icon:'✧', kind:'site',    blurb:'A single warm window at the edge of the western woods, where no warm window should be.' },
  pass:   { name:"Grinder's Pass", x:91, y:47, icon:'▲', kind:'site',    blurb:'The only road east. Something huge has been walking it at night.' },
  hold:   { name:'The Grey Hold',  x:61, y:9,  icon:'♜', kind:'locked',  blurb:'Fortress of the Quench. Its bells have rung for three hundred years. Chapter 2.' },
};
const VILLAGES = ['kettle','ashby','hollin'];

const UPGRADES = [
  { id:'vents', name:'Deeper Vents', max:3, cost:[50,110,180], d:(l) => `Open the old fire-vents. Warmth reaches ${l ? 'even ' : ''}further (+7 range).` },
  { id:'pool',  name:'Brood Pool',   max:1, cost:[70], d:() => 'A hot pool to sleep in. +15 max health, resting heals fully.' },
  { id:'forge', name:'Goblin Forge', max:1, cost:[60], d:() => 'Snikkit\'s cousins sharpen your claws. Claw and tail hit harder.', req:(s) => s.flags.goblins === 'allied', reqText:'Needs the goblins as allies' },
];

const ACH = [
  { id:'hatch',    t:'First Warmth',            d:'Break out of the last egg.' },
  { id:'steward',  t:'Fiscal Responsibility',   d:'Let Snikkit count your hoard.' },
  { id:'merciful', t:'Merciful Flame',          d:'Spare a knight of the Quench.' },
  { id:'ember',    t:'Mother\'s Scale',          d:'Accept the ember scale from Mirelle.' },
  { id:'hearths',  t:'Nobody Left in the Cold', d:'Save Kettle, Ashby and Hollin before winter.' },
  { id:'sunrise',  t:'Sunrise Statue',          d:'Hold the Grinder until the sun turns him to stone.' },
  { id:'slayer',   t:'Troll Slayer',            d:'Kill the Grinder in the dark.' },
  { id:'feared',   t:'A Name to Fear',          d:'Reach 60 dread.' },
  { id:'beloved',  t:'Hearth of the North',     d:'Reach 60 hope.' },
  { id:'free',     t:'An Unlikely Friend',      d:'Let Aurelia go free.' },
];
Object.assign(PEOPLE, { P9:{ name:'Edda', mono:'E' }, P10:{ name:'Ser Aldric', mono:'A' } });
