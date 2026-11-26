/* ═══════════ CHAPTER THREE · THE GILDED DEBT ═══════════ */
const SEASONS3 = [ { id:'harvest', name:'Harvest', flights:3 }, { id:'rains', name:'The Rains', flights:3 }, { id:'frost', name:'First Frost', flights:3 } ];
function SEAS(s = S){ return (s.chapter || 1) >= 3 ? SEASONS3 : SEASONS; }
function PL(s = S){ return (s.chapter || 1) >= 3 ? PLACES3 : PLACES; }
const LAIR3 = { x:22, y:78 };
const PLACES3 = {
  crown:      { name:'The Hollow Crown', x:22, y:78, icon:'♨', kind:'lair', blurb:'An ancient dragon tomb inside a hollow hill. The bones are old. The hoard around them is older.' },
  greywater:  { name:'Greywater',  x:45, y:68, icon:'⌂', kind:'town',  blurb:'A river village drowning in debt. Every roof has a Ledger mark painted on the door.' },
  road:       { name:'The Gold Road', x:44, y:44, icon:'⇄', kind:'site', blurb:'Treasure wagons roll from the mint to the capital every week, guarded by coin-knights.' },
  tarrow:     { name:'Tarrow Mint', x:18, y:38, icon:'◎', kind:'vault', blurb:'Chimneys, furnaces, and a vault where dragon gold is melted into crowns.' },
  shaft:      { name:'The Deep Shaft', x:20, y:14, icon:'◒', kind:'site', blurb:'Goblin mines in the north-western hills, dug under contract to the Ledger.' },
  assay:      { name:'The Old Assay', x:7,  y:57, icon:'✧', kind:'site', blurb:'A ruined tower on the moor where the Ledger once tested gold. Someone still lives there.' },
  ledgerhall: { name:'Ledgerhall', x:64, y:44, icon:'♜', kind:'city',  blurb:'The capital, and under its golden dome, the Ledger. Every debt in the realm is written here.' },
  saltbridge: { name:'Saltbridge', x:82, y:80, icon:'◎', kind:'vault', blurb:'The harbour. Its customs house keeps a vault for everything that comes in by sea.' },
};
Object.assign(ENEMIES, {
  coinknight: { name:'Coin-Knight',    art:'V7', sil:'knight', hp:36, tags:['human'], moves:['mace','tithe','shield','mace'], silver:30 },
  golem:      { name:'Vault Guardian', art:'V8', sil:'troll',  hp:72, tags:['construct'], moves:['windup','slam','grind'] },
  auditor:    { name:'The Auditor',    art:'V8', sil:'troll',  hp:170, tags:['construct','boss'], moves:['audit','windup','smash','grind','mace'] },
  vexarGilt:  { name:'Vexar, in gold chains', art:'V5', sil:'troll', hp:140, tags:['frost','boss','dragon'], moves:['coldfire','wingbeat','vchains','brood','coldfire'] },
});
Object.assign(MOVES, {
  mace:  { k:'atk', dmg:10, t:'swings a gilded mace' },
  tithe: { k:'spc', dmg:3,  t:'takes a tithe of your fire', label:'Tithe' },
  slam:  { k:'atk', dmg:15, t:'brings both fists down' },
  grind: { k:'def', blk:16, t:'locks its gears', label:'Lock' },
  audit: { k:'spc', dmg:6,  t:'reads your debts aloud', label:'Audit' },
});
Object.assign(ENCOUNTERS, {
  tithemen:  { foes:['coinknight'], bg:'A14', flee:false },
  caravan:   { foes:['coinknight','coinknight'], bg:'A14', flee:true },
  mint:      { foes:['golem'], bg:'A15', flee:false },
  customs:   { foes:['coinknight','golem'], bg:'A17', flee:false },
  bounty:    { foes:['coinknight','hunter','coinknight'], bg:'A16', flee:false },
  auditor:   { foes:['auditor'], bg:'A15', flee:false },
  vexarGilt: { foes:['vexarGilt'], bg:'A15', flee:false, redeem:true },
});
Object.assign(BG_FALLBACK, {
  A12:'linear-gradient(180deg,#3a2e18,#1a140a)',
  A13:'radial-gradient(40% 40% at 60% 30%,rgba(240,196,74,.35),transparent 70%),linear-gradient(180deg,#2a2236,#120e16)',
  A14:'linear-gradient(180deg,#e0a050 0%,#7a5420 45%,#2a1c0c)',
  A15:'radial-gradient(50% 40% at 50% 70%,rgba(240,196,74,.4),transparent 70%),linear-gradient(180deg,#1a160e,#0a0806)',
  A16:'radial-gradient(30% 30% at 50% 20%,rgba(255,220,150,.3),transparent 70%),linear-gradient(180deg,#2a2016,#100c08)',
  A17:'radial-gradient(30% 20% at 60% 60%,rgba(240,160,80,.35),transparent 70%),linear-gradient(180deg,#1c2a3a,#0a1018)',
});
Object.assign(PEOPLE, { P7:{ name:'Oriel Vance', mono:'O' }, P8:{ name:'Madam Selk', mono:'S' }, Q:{ name:'Brother Quill', mono:'Q' } });
ACH.push(
  { id:'memory3',  t:'Blood Remembers',   d:'Reclaim three ancestral memories.' },
  { id:'debtfree', t:'Debts Forgiven',    d:'Burn the Ledger\'s books.' },
  { id:'returned', t:'Gilded Liberation', d:'Give the Last Hoard back to the people.' },
  { id:'eternal',  t:'The Eternal Hoard', d:'Keep every coin of the Last Hoard.' },
  { id:'unsigned', t:'Read the Small Print', d:'Refuse to sign the Ledger.' },
);

const PERKS = {
  furnace:  { t:'Deep Furnace',   d:'+1 heat every turn.' },
  breath:   { t:"Mother's Breath", d:'Your breath hits 3 harder.' },
  hide:     { t:'Gilded Hide',     d:'Start every fight with 8 block.' },
  hunger:   { t:'Old Hunger',      d:'Devour works below 35% and heals 16.' },
  song:     { t:'Song of Gold',    d:'+12 gold every season.' },
  longlife: { t:'Long Memory',     d:'+15 max health.' },
};
const perk = (id, s = S) => !!(s.c3 && s.c3.perks.includes(id));
function offerPerks(){
  const left = Object.keys(PERKS).filter(k => !S.c3.perks.includes(k));
  const a = left.splice(Math.floor(Math.random() * left.length), 1)[0], b = left[Math.floor(Math.random() * left.length)];
  S.c3.offer = [a, b].filter(Boolean);
}

function startChapter3(){
  S.chapter = 3; S.season = 0; S.flights = 3; S.done = {}; S.hunted = -1; S.chapterDone = false;
  S.c3 = { perks:[], greed:10, bounty:0, offer:[], vaults:{ tarrow:'sealed', saltbridge:'sealed' }, greywater:'indebted' };
  S.sel = 'greywater'; S.hp = S.maxHp;
  openScene('ch3open');
}
function placeState3(id, s = S){
  const k = PLACES3[id].kind;
  if(k === 'lair') return 'warm';
  if(k === 'vault') return s.c3.vaults[id] === 'open' ? 'reclaimed' : 'sealed';
  if(id === 'greywater') return s.c3.greywater === 'free' ? 'free' : 'indebted';
  if(id === 'shaft') return s.flags.shaft ? 'ally' : 'site';
  if(id === 'ledgerhall') return s.done.great ? 'fallen' : 'ledger';
  return 'site';
}
function eventAt3(id, s = S){
  const d = s.done, se = s.season, f = s.flags;
  switch(id){
    case 'greywater': if(!d.greywater) return { scene:'greywater', label:'The tithe-men are collecting.' }; return null;
    case 'road': if(d['caravan' + se]) return null; return { scene:'caravan', label: d.selk ? 'A treasure convoy is on the road.' : 'Wagons, and an old woman with a lot of rings.' };
    case 'shaft': if(!d.shaft) return { scene:'shaft', label:'The rock here sings. So do the goblins.' }; return null;
    case 'assay': if(!d.quill) return { scene:'quill', label:'A light in the ruined tower.' }; return null;
    case 'tarrow': if(s.c3.vaults.tarrow === 'sealed' && (f.vaultsKnown || se >= 1)) return { scene:'tarrow', label:'The mint vault. Your blood is in there.' }; return null;
    case 'saltbridge': if(s.c3.vaults.saltbridge === 'sealed' && (f.vaultsKnown || se >= 1)) return { scene:'saltbridge', label:'The customs vault at the harbour.' }; return null;
    case 'ledgerhall':
      if(!d.oriel) return { scene:'oriel', label:'An invitation, sealed in gold wax.' };
      if(se === 2 && !d.great) return { scene:'greatVault', label:'The Great Vault. It is time.' };
      return null;
  }
  return null;
}
const SEASON_OPEN_3 = { 1:'ch3rains', 2:'ch3frost' };

Object.assign(SCENES, {
ch3open: { bg:'A16', place:'The Hollow Crown', title:'South, Following the Gold',
  text: (s) => [
    'You fly south for nine days with a Ledger coin in your claws, and the coin hums louder every day. On the tenth morning the snow ends, and below you lies Veyrmark: gold fields, white roads, and a marble city with a dome that catches the sun like a hoard.',
    'The coin leads you to a hollow hill in the south-west. Inside, curled around a scatter of dusty gold, lie the bones of a dragon bigger than any living thing you have seen. The coins in the dust hum the same note as the one in your claws.',
    s.flags.vexar === 'freed' ? 'Vexar lands beside you and goes very still. "This was a dragon\'s lair," he says. "Before the Ledger." He touches the skull with one claw, gently. "We should sleep here."' : 'You sleep there that night, in the curve of the old ribs. You dream in someone else\'s memories.',
    s.flags.goblins === 'allied' ? 'In the morning Snikkit climbs out of your saddle-bag, where he has apparently been for nine days. "Somebody," he says, "has to count."' : '',
  ].filter(Boolean),
  choices:[ { t:'Look out over Veyrmark', fx:{ note:'A new map: Veyrmark' }, go:'map' } ] },

greywater: { bg:'A14', place:'Greywater', title:'Every Door Marked',
  text:[
    'In Greywater every door has the same mark painted on it: an open book and a quill. The Ledger\'s mark. It means: this house owes.',
    'Two coin-knights in gilded plate are walking the street with a scribe, collecting. A family stands outside their house while the knights carry out the table, the chairs, the cradle.',
    '"Debts are sacred," the scribe tells the father, not unkindly. "Sacred things must be paid."',
  ],
  choices:[
    { t:'Pay their debt from your hoard', h:'40 gold. Greed falls, hope rises.', req:(s) => s.gold >= 40, fx:(s) => { s.c3.greed = Math.max(0, s.c3.greed - 10); s.c3.greywater = 'free'; return { gold:-40, hope:12, done:'greywater', note:'Greywater is free of the Ledger' }; },
      out:['You drop forty gold on the scribe\'s ledger. He stares at it, then at you, then writes PAID IN FULL with a hand that is shaking badly.','By evening someone has painted over every Ledger mark in Greywater. In its place, rough and red: a dragon.'] },
    { t:'Throw the knights out', fight:{ enc:'tithemen', win:'greywaterWon', lose:'defeat' } },
    { t:'This is not your fight', fx:{ done:'greywater', hope:-4 }, out:['The cradle goes onto the cart. The family watches you leave. So does the scribe, and he writes down which way you flew.'] },
  ] },
greywaterWon: { bg:'A14', place:'Greywater', title:'Paid in Fire',
  text:['The coin-knight goes into the river in his gilded plate and comes out much less gilded. The scribe drops his ledger and runs.','Greywater burns the ledger in the square that night and dances around it.'],
  choices:[ { t:'Fly home', fx:(s) => { s.c3.greywater = 'free'; s.c3.bounty += 10; return { hope:10, dread:3, done:'greywater', note:'Bounty on your head rises' }; } } ] },

caravan: { bg:'A14', who:'P8', place:'The Gold Road', title: (s) => s.done.selk ? 'Treasure Wagons' : 'Madam Selk',
  text: (s) => s.done.selk ? [
    'Six iron-banded wagons roll towards Ledgerhall, guarded by coin-knights. Every wagon hums. Every coin in them was once a dragon\'s.',
    s.flags.selk ? 'Madam Selk was right about the time and the road. She is always right about roads.' : '',
  ].filter(Boolean) : [
    'An old woman sits on the lead wagon of a caravan that is very obviously not a Ledger caravan: painted wheels, goats, a parrot. She watches you land and does not stop knitting.',
    '"Madam Selk," she says. "Forty years on these roads. I know when every Ledger convoy leaves the mint, which knights are drunk and which bridges are rotten." She holds up the knitting. "Information has a price. A cut of what you take. Fair?"',
  ],
  choices:[
    { t:'Deal: she gets a cut', req:(s) => !s.done.selk, fx:{ flags:{ selk:true, vaultsKnown:true }, done:'selk', note:'Selk will report the convoys and the vaults' },
      out:['"Lovely," says Selk. "First thing for free: the mint at Tarrow and the customs house at Saltbridge both keep dragon gold in their vaults. Old gold. Yours, I suspect." She tilts her head. "You can hear it, can\'t you."'] },
    { t:'No deals', req:(s) => !s.done.selk, fx:{ done:'selk' }, out:['"Suit yourself," says Selk, and drives on. The parrot says something rude about dragons.'] },
    { t:'Raid the convoy', req:(s) => !!s.done.selk, fight:{ enc:'caravan', win:'caravanWon', lose:'defeat' } },
    { t:'Let it pass', req:(s) => !!s.done.selk, go:'map', refund:true },
  ] },
caravanWon: { bg:'A14', place:'The Gold Road', title:'Wagons on Their Sides',
  text:['The convoy lies scattered across the road, wheels still turning. The gold is warm by the time you have gathered it.'],
  choices:[ { t:'Fly home', fx:(s) => { s.done['caravan' + s.season] = true; s.c3.bounty += 8; s.c3.greed += 6; const cut = s.flags.selk ? 15 : 0; return { gold:55 - cut, note: cut ? 'Selk takes her cut' : 'The Ledger raises your bounty' }; } } ] },

shaft: { bg:'A5', who:'P1', place:'The Deep Shaft', title: (s) => s.flags.goblins ? 'Cousins' : 'The Deep Shaft',
  text: (s) => [
    'The goblins of the Deep Shaft dig for the Ledger, under a contract nobody can read because the Ledger wrote it. They are thin, and grey with dust, and they sing while they work: the same note the coins sing.',
    s.flags.goblins ? 'Their forewoman takes one look at Snikkit and shrieks. "Gnash\'s nephew! The one who can count!" Snikkit turns a dignified purple.' : 'Their forewoman, a goblin with a pickaxe taller than she is, looks at you for a long time. "You hear it too," she says. "The singing."',
    '"The contract says we dig until the debt is paid," she says. "The debt is never paid."',
  ],
  choices:[
    { t:'Buy out their contract', h:'50 gold. They dig for you instead.', req:(s) => s.gold >= 50, fx:{ gold:-50, flags:{ shaft:true, vaultsKnown:true }, done:'shaft', hope:6 },
      out:['The forewoman tears the contract in half, then in quarters, then eats a quarter for good measure. The Deep Shaft is yours. They will dig gold, and they will tell you where every vault in Veyrmark sings loudest.'] },
    { t:'Tell them to walk out', h:'Free. The Ledger will notice.', fx:(s) => { s.c3.bounty += 8; return { flags:{ shaft:true, vaultsKnown:true }, done:'shaft', hope:8, dread:2 }; },
      out:['They walk out singing, four hundred goblins with pickaxes, straight past the Ledger\'s overseer, who wisely says nothing at all.'] },
  ] },

quill: { bg:'A6', who:'Q', place:'The Old Assay', title:'Brother Quill',
  text:[
    'The ruined tower is full of books, and the books are full of numbers, and in the middle of them sits an old man with ink up to his elbows.',
    '"Brother Quill. Former assayer to the Ledger. Former believer." He shows you a page. "Every coin the Ledger owns, listed. Weight, purity, origin. Origin." His finger taps a column. "Dragon. Dragon. Dragon. Three hundred years of stolen hoards, and they kept the receipts."',
    '"Gold remembers," he says. "If you listen to it right, it will tell you who it belonged to. And what they knew."',
  ],
  choices:[ { t:'Teach me to listen', h:'Your first ancestral memory.', fx:(s) => { offerPerks(); return { done:'quill', flags:{ vaultsKnown:true } }; }, go:'memory' } ] },

memory: { bg:'A16', place:'A memory', title:'The Gold Remembers',
  text:['You lie on the old gold and listen. Under the humming there are voices, and under the voices there are lives: dragons who flew before the Quench, who knew things you were never taught.','Two memories rise. You can only hold one.'],
  choices: (s) => (s.c3.offer || []).map(k => ({ t:PERKS[k].t, h:PERKS[k].d, fx:(st) => { st.c3.perks.push(k); if(k === 'longlife'){ st.maxHp += 15; st.hp += 15; } if(st.c3.perks.length >= 3) unlock('memory3'); return { note:`Memory: ${PERKS[k].t}` }; } })) },

tarrow: { bg:'A15', place:'Tarrow Mint', title:'The Furnaces of Tarrow',
  text:['Under the mint, behind a round iron door, the vault of Tarrow holds the gold that has not yet been melted into crowns. You can hear it from the street: a chorus, all on one note.','In front of the door stands a guardian of brass and coins, older than the Ledger. Its keyhole chest begins to glow.'],
  choices:[ { t:'Break the vault', fight:{ enc:'mint', win:'tarrowWon', lose:'defeat' } } ] },
tarrowWon: { bg:'A15', place:'Tarrow Mint', title:'Unmelted',
  text:['The guardian comes apart in a rain of coins. Behind it, the vault: and in the vault, a hoard that has been waiting for you for three hundred years.'],
  choices:[ { t:'Take it home, and listen', fx:(s) => { s.c3.vaults.tarrow = 'open'; s.c3.bounty += 10; offerPerks(); return { gold:70 }; }, go:'memory' } ] },
saltbridge: { bg:'A17', place:'Saltbridge', title:'The Customs House',
  text: (s) => [
    'Saltbridge\'s customs house stands on the quay like a fist. Its vault is underneath, below the waterline, where the Ledger keeps what comes in from the sea.',
    s.flags.selk ? 'Madam Selk has one of her nephews on the night watch. The side door is unlocked. The guardian is not.' : 'A coin-knight paces the quay. Below, something heavy turns its gears.',
  ],
  choices:[ { t:'Go in', fight:{ enc:'customs', win:'saltbridgeWon', lose:'defeat' } } ] },
saltbridgeWon: { bg:'A17', place:'Saltbridge', title:'Below the Waterline',
  text:['The vault floods as you break it, and the gold comes up out of the black water singing.'],
  choices:[ { t:'Take it home, and listen', fx:(s) => { s.c3.vaults.saltbridge = 'open'; s.c3.bounty += 10; offerPerks(); return { gold:80 }; }, go:'memory' } ] },

oriel: { bg:'A13', who:'P7', place:'Ledgerhall', title:'An Invitation',
  text:[
    'The invitation is delivered by a coin-knight who does not draw his mace. It is written in gold ink: Assayer-General Oriel Vance requests the pleasure of a conversation.',
    'She meets you on the steps of the golden dome, alone, with a ledger under her arm. "We are not the Quench," she says. "We do not hate you. We do not hate anything. We simply keep accounts."',
    '"So, an account. Sign your name in the Ledger, and you will be paid two hundred gold every season, for as long as you live. In return you will not touch our vaults." She opens the book. There is a line waiting, and a quill. "It is a very good offer. It is a very long life."',
  ],
  choices:[
    { t:'Sign', h:'Gold every season. Read the small print?', fx:{ flags:{ signed:true }, done:'oriel', gold:60 },
      out:['You sign. The ink is warm. Oriel Vance smiles for the first time and closes the book very gently.','Only later does Snikkit read the clause on the next page, the one in very small letters: a dragon who signs the Ledger is itself an asset of the Ledger, to be collected upon default.'] },
    { t:'Refuse', fx:{ done:'oriel', hope:4, ach:'unsigned' }, out:['"A pity," says Oriel Vance, and means it. "Debts are sacred, dragon. Even the ones you refuse to owe."'] },
    { t:'Burn the book in her hands', fx:(s) => { s.c3.bounty += 15; return { done:'oriel', dread:10, wild:5 }; },
      out:['The book goes up in your fire. Oriel Vance does not let go of it until it is ash. Then she looks at her burned hands, and then at you, and writes something on her cuff with a finger of soot.','Every coin-knight in Veyrmark is looking for you by nightfall.'] },
  ] },

bounty: { bg:'A16', place:'The Hollow Crown', title:'Collectors',
  text: (s) => [`The Ledger has put a price on your head: ${100 + s.c3.bounty * 5} crowns. The collectors come at night, into your hollow hill, with nets and gilded maces.`],
  choices:[ { t:'Defend your lair', fight:{ enc:'bounty', win:'bountyWon', lose:'defeat' } } ] },
bountyWon: { bg:'A16', place:'The Hollow Crown', title:'Returned to Sender',
  text:['You send the collectors back to Ledgerhall without their maces, their nets or, in one case, their trousers.'],
  choices:[ { t:'Rest', fx:{ gold:30, dread:4, done:'bounty' } } ] },

ch3rains: { bg:'A13', place:'Veyrmark', title:'The Rains',
  text: (s) => [
    'The autumn rains come, and with them, news. The Ledger has doubled the guard on every road. The price of bread in Ledgerhall has risen twice in a month: there is less gold in circulation than there used to be, and everyone knows why.',
    s.c3.greed >= 40 ? 'In Greywater, people have started saying the dragon is no better than the bank. Just bigger.' : 'In Greywater, children play dragon-and-knights in the mud, and the dragon always wins.',
  ],
  choices:[ { t:'Fly', go:'map' } ] },
ch3frost: { bg:'A13', who:'P7', place:'Ledgerhall', title:'First Frost',
  text: (s) => [
    'The first frost silvers the golden dome. Oriel Vance has closed the city gates.',
    s.flags.signed ? 'A letter arrives under gold seal: the Ledger finds you in breach of contract, and will be collecting the asset in person.' : 'A letter arrives under gold seal. It contains a single line: Come and audit us, then.',
    'Under Ledgerhall lies the Great Vault, and in it, they say, the Last Hoard: the gold of every dragon the Quench ever drowned.',
  ],
  choices:[ { t:'Fly', go:'map' } ] },

greatVault: { bg:'A15', who:'P7', place:'The Great Vault', title:'The Last Hoard',
  text: (s) => [
    'The Great Vault is not a room. It is a cathedral underground: gold in hills, in drifts, in rivers, under a ceiling painted with every dragon the Quench drowned, and beside each dragon, its weight in crowns.',
    'Oriel Vance stands on a balcony of ledgers. "Three hundred years of accounts," she says. "Every coin a dragon. Every dragon a coin. It balances. It always balances."',
    s.flags.vexar === 'fled' ? 'Below her, chained in gold instead of iron, crouches Vexar. The Ledger bought him from what was left of the Quench. "An asset," says Oriel Vance, "to collect an asset."' : s.flags.vexar === 'freed' ? 'Behind you, Vexar\'s breath goes blue in the dark. From the far end of the vault, something enormous and brass begins to turn its gears. "The Auditor," says Oriel Vance. "It has never once been wrong."' : 'From the far end of the vault, something enormous and brass begins to turn its gears. "The Auditor," says Oriel Vance. "It has never once been wrong."',
  ],
  choices:[ { t:'Fight', fx:{ done:'great' }, fight:{ enc:'__great', win:'greatWon', lose:'greatLost' } } ] },
greatWon: { bg:'A15', who:'P7', place:'The Great Vault', title: (s) => s.flags.giltFreed ? 'Brothers' : 'The Accounts Close',
  text: (s) => s.flags.giltFreed ? [
    'Gold chains melt the way iron ones do, if the fire is given and not taken. Vexar shakes them off and looks at you, and then up at Oriel Vance on her balcony, and for the first time in his life his breath is not blue. It is the colour of yours.',
  ] : [
    'The last of your enemies falls, and the vault is silent but for the humming of three hundred years of gold.',
  ],
  choices:[ { t:'Climb to the balcony', fx:(s) => s.flags.giltFreed ? { hope:12, flags:{ vexar:'freed' }, ach:'brother' } : {}, go:'lastHoard' } ] },
greatLost: { bg:'A15', who:'P7', place:'The Great Vault', title:'Collected',
  text:['You wake in chains of gold, in a cage of gold, while Oriel Vance writes the date in her ledger. It takes Snikkit, the goblins of the Deep Shaft and half of Greywater three days to dig you out.','When they do, Oriel Vance is waiting at the vault door, alone. She has not run. Accountants do not run.'],
  choices:[ { t:'Face her', fx:{ hope:-6 }, go:'lastHoard' } ] },
lastHoard: { bg:'A15', who:'P7', place:'The Great Vault', title:'The Eternal Hoard',
  text:[
    'Oriel Vance closes her ledger. "Well," she says. "It is yours. Every coin. What will you do with it? Lend it out? Spend it? Sleep on it, like your mother did?" She smiles thinly. "Or will you burn the books and let the whole realm forget what it owes? Choose carefully. Whoever holds this gold holds Veyrmark."',
  ],
  choices:[
    { t:'Give it back to the people', h:'Every village, every debt. Greed falls to nothing.', fx:(s) => { s.c3.greed = 0; return { hope:20, gold:100, flags:{ last:'returned' }, ach:'returned' }; }, go:'ch3end' },
    { t:'Burn the Ledger\'s books', h:'All debts forgotten. The realm in chaos, and free.', fx:{ hope:12, dread:8, gold:300, flags:{ last:'burned' }, ach:'debtfree' }, go:'ch3end' },
    { t:'Keep it. All of it.', h:'The Eternal Hoard. You become the bank.', fx:(s) => { s.c3.greed = 100; return { gold:1000, dread:15, hope:-10, flags:{ last:'kept' }, ach:'eternal' }; }, go:'ch3end' },
  ] },
ch3end: { bg:'A13', place:'Ledgerhall', title:'The Gilded Debt',
  text: (s) => [
    { returned:'For a month, every village in Veyrmark wakes up to find gold on its doorstep, warm to the touch. The golden dome is turned into a granary. Oriel Vance is given a desk in it, and a ledger, and the job of counting bread.',
      burned:'The Ledger burns for a week, and with it every debt in Veyrmark. Nobody knows who owns what anymore. Nobody owes anybody. It is chaos, and it is the happiest chaos the south has ever known.',
      kept:'You sleep on the Last Hoard under the golden dome, and Veyrmark learns to pay its debts to you instead. The gold is very warm. The realm is very quiet. Some nights, very faintly, you hear the coins singing your mother\'s name, and you cannot remember whether they ever sang anything else.' }[s.flags.last],
    'Deep in the vault, under the last drift of gold, you find one thing that is not a coin: a stone tablet, older than the Ledger and older than the Quench, carved with a single word in the old tongue of dragons and men.',
    'Covenant.',
  ],
  choices:[ { t:'End of chapter three', go:'end' } ] },
});
