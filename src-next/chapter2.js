/* ═══════════ CHAPTER TWO · THE GREY HOLD ═══════════ */
Object.assign(ENEMIES, {
  hunter: { name:'Frost Huntsman', art:'V6', sil:'knight', hp:26, tags:['human'], moves:['spear','net','spear'], silver:14 },
  vexar:  { name:'Vexar',          art:'V5', sil:'troll',  hp:130, tags:['frost','boss','dragon'], moves:['coldfire','wingbeat','vchains','brood','coldfire','wingbeat'] },
});
Object.assign(MOVES, {
  spear:    { k:'atk', dmg:8,  t:'thrusts a boar-spear' },
  net:      { k:'spc', dmg:4,  t:'throws a weighted net', label:'Net' },
  coldfire: { k:'spc', dmg:11, t:'breathes cold fire', label:'Cold fire' },
  wingbeat: { k:'atk', dmg:8,  t:'batters you with his wings' },
  vchains:  { k:'spc', dmg:5,  t:'lashes you with his chains', label:'Chains' },
  brood:    { k:'def', blk:14, t:'folds his wings around himself', label:'Brood' },
});
Object.assign(ENCOUNTERS, {
  vexarDuel: { foes:['vexar'], bg:'A8', flee:false, breakAt:.55 },
  hunters:   { foes:['hunter','hunter'], bg:'A10', flee:false },
  siege:     { foes:['knight','knight','warden'], bg:'A4', flee:false },
  gate:      { foes:['knight','warden','knight'], bg:'A7', flee:false },
  vexar:     { foes:['vexar'], bg:'A11', flee:false, redeem:true },
});
BG_FALLBACK.A10 = 'radial-gradient(30% 30% at 60% 60%,rgba(240,160,80,.3),transparent 70%),linear-gradient(180deg,#26313b,#10161c)';
BG_FALLBACK.A11 = 'radial-gradient(40% 40% at 50% 30%,rgba(166,212,238,.35),transparent 70%),linear-gradient(180deg,#1c2630,#0a0e12)';
PEOPLE.P6 = { name:'Lord Harrow', mono:'H' };
PEOPLE.P5 = PEOPLE.P5 || { name:'Ysolde Marr', mono:'Y' };
PLACES.rimeholt = { name:'Rimeholt', x:24, y:70, icon:'⛫', kind:'site', ch:2, blurb:'A stockade of ice-blocks and furs. Lord Harrow sells winter to anyone who can pay, and winter has been very good for business.' };
ACH.push(
  { id:'brother',  t:'Brother',             d:'Break Vexar\'s chains with fire freely given.' },
  { id:'bell',     t:'The Bell Falls Silent', d:'Take the Grey Hold.' },
  { id:'undermine',t:'Undermined',          d:'Enter the Grey Hold through a goblin tunnel.' },
  { id:'mercy2',   t:'Not Like Them',       d:'Spare the High Warden.' },
);
const SEASON_OPEN_2 = { 1:'ch2summer', 2:'ch2ashfall' };
const canRedeem = (s = S) => s.hope >= 40 && (s.flags.knowsVexar || s.flags.chainsLore);

function startChapter2(){
  const keep = S.flags;
  S.chapter = 2; S.season = 0; S.flights = 3; S.done = {}; S.hunted = -1; S.chapterDone = false;
  S.flags = Object.assign({}, keep, { dawned: keep.dawned });
  S.hp = S.maxHp;
  openScene('ch2open');
}

function eventAt2(id, s = S){
  const f = s.flags, d = s.done, se = s.season;
  switch(id){
    case 'pass': if(!d.vexarSeen) return { scene:'ch2open', label:'Vexar is waiting.' }; return null;
    case 'rimeholt':
      if(!d.harrow) return { scene:'harrow', label:'Lord Harrow wants to talk business.' };
      if(f.harrow === 'pact' && se >= 1 && !d.harrowBetray) return { scene:'harrowBetray', label:'Smoke over Rimeholt. Something is wrong.' };
      return null;
    case 'warren':
      if(!d.tunnel && f.goblins) return { scene:'tunnel', label:'Old Gnash has a plan involving shovels.' };
      return null;
    case 'hut': if(!d.chains) return { scene:'chainsLore', label:'Mirelle knows something about chains.' }; return null;
    case 'kettle': case 'ashby': case 'hollin': {
      if(s.places[id] === 'lost') return null;
      if(!d.refugees && se === 0 && id === firstSaved(s)) return { scene:'refugees', label:'Refugees from the north are at the gate.' };
      if(id === 'ashby' && f.aurelia && !d.aureliaMeet && se <= 1) return { scene: f.aurelia === 'held' ? 'aureliaHeld' : 'aureliaFree', label:'Aurelia wants to talk.' };
      if(se === 2 && !d['kindle2_' + id] && s.places[id] === 'frozen') return { scene:'kindleLate_' + id, label:'It could still be warmed.' };
      return null; }
    case 'pines': if(s.hunted === se) return null; return { scene:'pines', label:'The wolves are back.' };
    case 'hold': if(se === 2 && !d.hold) return { scene:'holdApproach', label:'The Grey Hold. It is time.' }; return null;
  }
  return null;
}
function firstSaved(s){ return ['kettle','ashby','hollin'].find(v => s.places[v] === 'saved' || s.places[v] === 'kindled') || 'kettle'; }

Object.assign(SCENES, {
ch2open: { bg:'A8', who:'V5', place:"Grinder's Pass", title:'The Answer',
  text: (s) => [
    'He is waiting on the pass where you left the Grinder, coiled around the rock like frost around a branch. Up close he is smaller than you expected, and older, and the chains have worn grooves in his scales.',
    '"They told me you would come," says Vexar. His voice is cold and quiet, a voice that has only ever been allowed to whisper. "They told me what you are. A fire. A sin. The thing that ends the world."',
    s.flags.knowsVexar ? 'You know his story. Mirelle told you, or Aurelia did. The egg they kept. The cellar. The cold water.' : 'He looks like you. Under the frost, under the chains, the shape of his skull is your shape.',
    '"High Warden Ysolde says I may bring you back alive," he says. "Or not."',
  ],
  choices:[
    { t:'Fight him', h:'He is strong, and he does not want to stop.', fight:{ enc:'vexarDuel', win:'vexarBreaks', lose:'vexarWins' } },
    { t:'Call him brother', h:'He has never heard the word.', req:(s) => !!s.flags.knowsVexar, fx:{ hope:4, flags:{ calledBrother:true }, done:'vexarSeen' },
      out:['Vexar flinches as if you had struck him. For a long moment the cold fire in his throat goes out entirely.','"I have no brother," he says, and leaves. He flies badly. He has never been allowed to fly far.'] },
    { t:'Let him go', fx:{ done:'vexarSeen' }, out:['You turn your back. It is either the bravest or the stupidest thing you have ever done. Behind you, chains rattle, wings open, and he is gone towards the north.'] },
  ] },
vexarBreaks: { bg:'A8', who:'V5', place:"Grinder's Pass", title:'The Bell Calls',
  text:['Far to the north, the bell of the Grey Hold rings three times. Vexar freezes mid-strike, as if the sound were a hand on his collar.','"Not yet," he says, to the bell or to you. Then he is gone, trailing frost and chains, and the pass is yours.'],
  choices:[ { t:'Fly home', fx:{ done:'vexarSeen', flags:{ duelled:true }, dread:3 } } ] },
vexarWins: { bg:'A8', who:'V5', place:"Grinder's Pass", title:'Cold',
  text:['You wake in the snow with frost in your lungs. Vexar is gone. He could have dragged you north. He did not.','You wonder why. So, you suspect, does he.'],
  choices:[ { t:'Limp home', fx:{ done:'vexarSeen', hope:-3 } } ] },

harrow: { bg:'A10', who:'P6', place:'Rimeholt', title:'A Man Who Sells Winter',
  text:[
    'Lord Harrow receives you in a hall made of ice-blocks, wearing more furs than any one animal has ever owned. He does not seem afraid of you. He seems to be pricing you.',
    '"The Quench sell the north its faith," he says. "I sell it everything else. Furs. Ice. Grain, to the villages that can still pay. Winter is my trade, dragon. You are bad for trade."',
    '"So. A proposal. You keep your south. I keep my north. And a little something, every season, to keep us both reasonable."',
  ],
  choices:[
    { t:'Take his gold', h:'A pact. 30 gold now, more each season.', fx:{ gold:30, flags:{ harrow:'pact' }, done:'harrow' },
      out:['He smiles like a man who has just bought something cheap. The gold is real, at least. It is cold when it arrives, and warm by morning.'] },
    { t:'Burn his ice stores', h:'His huntsmen will fight.', fight:{ enc:'hunters', win:'harrowBurned', lose:'defeat' } },
    { t:'Tell him the winter is ending', fx:{ dread:5, flags:{ harrow:'warned' }, done:'harrow' },
      out:['"Everything ends," says Harrow. "The trick is to sell before it does." He is already writing to the Grey Hold before your shadow leaves his wall.'] },
  ] },
harrowBurned: { bg:'A10', who:'P6', place:'Rimeholt', title:'Meltwater',
  text:['Rimeholt\'s ice-stores go up in a roar of steam. Twelve years of hoarded winter runs down the hill as water.','The villages Harrow starved will hear of this by nightfall. So will Harrow\'s friends in the Grey Hold.'],
  choices:[ { t:'Fly home', fx:{ hope:10, dread:4, gold:20, flags:{ harrow:'burned' }, done:'harrow' } } ] },
harrowBetray: { bg:'A10', place:'Rimeholt', title:'Business Is Business',
  text:['Rimeholt is empty. Harrow is gone, and so are his furs, his ledgers and his huntsmen. On the gate, nailed with an icicle, is a receipt from the Grey Hold: for information regarding the dragon\'s lair, paid in full.'],
  choices:[ { t:'Remember this', fx:{ flags:{ betrayed:true }, done:'harrowBetray', hope:-2 } } ] },

tunnel: { bg:'A5', who:'P1', place:'The Warren', title:'Shovels',
  text:[
    'Old Gnash unrolls a map that is mostly gravy stains. "The Grey Hold sits on rock," he says. "Rock has insides. Goblins are very good at insides."',
    'Snikkit coughs. "It would take a season. And forty gold. Shovels are not free. Neither are goblins, technically, under the new arrangements."',
  ],
  choices:[
    { t:'Pay for the tunnel', h:'40 gold. A way into the Hold.', req:(s) => s.gold >= 40, fx:{ gold:-40, flags:{ tunnel:true }, done:'tunnel' },
      out:['The warren disappears underground for a season. Occasionally you hear singing through the rock, far to the north.'] },
    { t:'Not now', go:'map', refund:true },
  ] },

chainsLore: { bg:'A6', who:'P3', place:"Mirelle's Hut", title:'Cold Iron',
  text:[
    '"His chains were forged in the Lake of Ash," Mirelle says, "from the same iron that drowned your mother. They feed on fire. Burn them, and they drink it, and grow colder."',
    'She turns the ember scale over in her fingers, or the memory of it. "Fire that is taken, they eat. Fire that is given, freely, to someone who does not ask for it..." She shrugs. "No one has ever tried. No dragon has ever cared enough about a Quench dragon to try."',
    '"It will only work if he can believe you. People who are loved are easier to believe."',
  ],
  choices:[
    { t:'Remember every word', h:'With enough hope, you could free him.', fx:{ flags:{ chainsLore:true }, done:'chains', hope:2 },
      out:['When you leave, Mirelle calls after you: "And bring him here after. He will need a warm room and somebody who does not want anything from him."'] },
  ] },

refugees: { bg:'A4', place:'Refugees', title:'Out of the North',
  text:[
    'They come in a long grey line out of the north: families from villages under Harrow\'s ice and the Quench\'s bells, carrying what they could. They have heard there is a place in the south where the snow melts.',
    'There are a lot of them. Your villages are not large.',
  ],
  choices:[
    { t:'Take them in', h:'Hope, and more mouths.', fx:{ hope:12, gold:-15, done:'refugees' },
      out:['It is crowded. It is loud. It is warm. By the end of the season the refugees are digging new houses and the old villagers are pretending to complain about it.'] },
    { t:'Send them to the warren', req:(s) => s.flags.goblins === 'allied', fx:{ hope:8, done:'refugees', flags:{ warrenGrew:true } },
      out:['Old Gnash takes one look and says the warren could use more hands that are not goblin-shaped. Within a week the humans are mining and the goblins are learning to bake.'] },
    { t:'Turn them away', fx:{ hope:-8, dread:4, gold:10, done:'refugees' },
      out:['They go on south, past your warmth, into the dark. Some of them leave payment anyway, for the night they spent near your fire.'] },
  ] },

aureliaFree: { bg:'A9', who:'P4', place:'Ashby', title:'A Letter, and Then a Girl',
  text:[
    'Aurelia is waiting at the ford with her hood down and her mother\'s seal on a stolen letter.',
    '"She is going to march," she says. "Three companies. Before the summer is out. And after that she is going to bring Vexar against you." She hesitates. "I can open the north gate of the Hold. If you come."',
  ],
  choices:[
    { t:'Accept her help', fx:{ flags:{ inside:true }, done:'aureliaMeet', hope:3 }, out:['"Ashfall," she says. "When the bell rings for evening prayer. I will be at the gate." Then she is gone, back to a fortress where she is the only person who knows what green grass looks like.'] },
    { t:'Tell her to stay safe', fx:{ done:'aureliaMeet', hope:5 }, out:['She laughs, for the first time since you have known her. "Nothing in the Grey Hold is safe," she says. "But thank you."'] },
  ] },
aureliaHeld: { bg:'A3', who:'P4', place:'Your lair', title:'The Guest',
  text:['Aurelia has spent the winter teaching Snikkit to read faster and learning to sleep in a warm room. Now she stands at the mouth of your cave, looking north.','"Send me back," she says. "My mother will believe I escaped. I can open the north gate when you come."'],
  choices:[
    { t:'Send her back', fx:{ flags:{ inside:true, aurelia:'free' }, done:'aureliaMeet' }, out:['She leaves at dawn with a story about a daring escape. Snikkit has helped her rehearse it. It is a very good story.'] },
    { t:'Keep her safe here', fx:{ done:'aureliaMeet', hope:4 }, out:['She does not argue. She does look north for a long time.'] },
  ] },

siege: { bg:'A4', who:'P5', place:'The siege', title:'Three Companies',
  text: (s) => [
    `The Quench come in the last week of summer: three companies in ice-steel, marching under the snuffed candle. They stop outside ${PLACES[firstSaved(s)].name} and begin pouring water on the snow.`,
    'At their head rides a woman with short grey hair and a scar across her chin. She does not look up at you. She does not need to.',
    '"In the name of the Quench," says High Warden Ysolde Marr, "this fire ends today."',
  ],
  choices:[ { t:'Defend the village', fight:{ enc:'siege', win:'siegeWon', lose:'siegeLost' } } ] },
siegeWon: { bg:'A4', who:'P5', place:'The siege', title:'The Retreat',
  text:['The companies break. Ysolde Marr is the last to leave the field, walking, her horse dead in the slush behind her.','"Come to the Hold, then," she calls up to you. "Come and see what we built to answer you."'],
  choices:[ { t:'Fly home', fx:{ hope:8, flags:{ siegeWon:true }, done:'siege' } } ] },
siegeLost: { bg:'A4', place:'The siege', title:'Water and Ash',
  text: (s) => [`They drive you off with water and chains, and spend the night drowning every hearth in ${PLACES[firstSaved(s)].name}. The people survive. The fires do not.`],
  choices:[ { t:'Endure', fx:{ hope:-10, gold:-15, done:'siege' } } ] },

ch2summer: { bg:'A3', who:'P2', place:'The Spring', title:'The Second Summer',
  text: (s) => [
    'The summer is longer this year. Everyone says so. In the south they have started planting things that need more than six weeks.',
    s.flags.goblins ? 'Snikkit reads the reports aloud: Quench companies gathering at the Grey Hold. Harrow\'s riders on every road. And one line underlined twice: "the blue one has been seen flying at night, alone."' : 'The goblins leave another charcoal note: "GRAY ARMY COMING. ALSO BLU DRAGON FLYS AT NITE. ALONE."',
  ],
  choices:[ { t:'Fly', go:'map' } ] },
ch2ashfall: { bg:'A7', place:'The Grey Hold', title:'The Bell',
  text: (s) => [
    'Ash falls again, and with it, the bell of the Grey Hold starts ringing and does not stop. Day and night. It rings for prayer, for war, for the dragon in its cellar.',
    'Before winter comes back, one of you will have to silence it.',
    s.flags.tunnel ? 'Old Gnash sends word: the tunnel is finished. It comes up under the chapel floor.' : '',
  ].filter(Boolean),
  choices:[ { t:'Fly', go:'map' } ] },

kindleLate_kettle:  { bg:'A4', place:'Kettle', title:'Last Chance', text:['Kettle shivers at the edge of your warmth.'], choices:[ { t:'Kindle it', fx:{ kindle:'kettle', hope:6, done:'kindle2_kettle' } }, { t:'Not now', go:'map', refund:true } ] },
kindleLate_ashby:   { bg:'A9', place:'Ashby', title:'Last Chance', text:['Ashby shivers at the edge of your warmth.'], choices:[ { t:'Kindle it', fx:{ kindle:'ashby', hope:6, done:'kindle2_ashby' } }, { t:'Not now', go:'map', refund:true } ] },
kindleLate_hollin:  { bg:'A4', place:'Hollin', title:'Last Chance', text:['Hollin shivers under the peaks.'], choices:[ { t:'Kindle it', fx:{ kindle:'hollin', hope:6, done:'kindle2_hollin' } }, { t:'Not now', go:'map', refund:true } ] },

/* ── The assault ── */
holdApproach: { bg:'A7', place:'The Grey Hold', title:'Under the Bell',
  text: (s) => [
    'The Grey Hold stands on its cliff like a tombstone with towers. Every window is lit. Every wall is wet: they have been pouring water down the stones for days, to make them hard to burn.',
    s.flags.tunnel ? 'Somewhere under the chapel, forty goblins are waiting with shovels and a great deal of excitement.' : '',
    s.flags.inside ? 'At the north gate, one lantern swings back and forth. Aurelia.' : '',
    'The bell is still ringing.',
  ].filter(Boolean),
  choices:[
    { t:'Come up through the goblin tunnel', h:'Skip the walls.', req:(s) => !!s.flags.tunnel, fx:{ ach:'undermine', done:'hold' }, go:'holdTower',
      out:['The chapel floor bursts upward in a shower of flagstones and goblins. By the time the Quench understand what has happened, you are already inside, and Old Gnash is ringing the bell himself, very badly.'] },
    { t:'Fly to Aurelia\'s gate', h:'She opens it from inside.', req:(s) => !!s.flags.inside, fx:{ done:'hold', hope:3 }, go:'holdTower',
      out:['The north gate swings open on oiled hinges. Aurelia stands in it with her lantern, white-faced and furious and very brave. "Up," she says. "He is in the bell tower. With her."'] },
    { t:'Break the gate', h:'The hard way.', fight:{ enc:'gate', win:'gateWon', lose:'gateLost' } },
  ] },
gateWon: { bg:'A7', place:'The Grey Hold', title:'Through the Gate',
  text:['The gate goes down in steam and splinters. Beyond it, in the courtyard, the Quench lay down their lances one by one.','Above you the bell has stopped. In the silence you can hear chains moving, high in the tower.'],
  choices:[ { t:'Climb the tower', fx:{ done:'hold' }, go:'holdTower' } ] },
gateLost: { bg:'A7', place:'The Grey Hold', title:'Driven Off',
  text:['The walls are too wet and the lances too many. You fall back into the snow with ice in your wings.','But they are exhausted too. When you rise again at dusk, the gate is still broken from your first attack.'],
  choices:[ { t:'Go again, through the breach', fx:(s) => ({ hp: Math.max(0, Math.round(s.maxHp * .6) - s.hp), done:'hold' }), go:'holdTower' } ] },

holdTower: { bg:'A11', who:'P5', place:'The bell tower', title:'The High Warden',
  text: (s) => [
    'At the top of the tower, under the great bronze bell, High Warden Ysolde Marr waits with a lantern and a key. Behind her, chained to the beams, is Vexar.',
    '"Three hundred years," says Ysolde. "Three hundred years we kept the fire out of the world. Do you know what it cost? Do you know who paid?" She laughs, without any warmth at all. "Not us. Never us. The Ledger in the south paid for every lance. We only did the drowning."',
    'She turns the key. The chains fall away from Vexar\'s collar, and only from his collar. The rest stay. "Answer," she says to him. "Put it out."',
    canRedeem(s) ? 'You remember what Mirelle said. Fire that is given, freely. And you think, for the first time, that he might believe you.' : 'Vexar rises. His eyes are wet. His breath is blue.',
  ],
  choices:[ { t:'Face your brother', fight:{ enc:'vexar', win:'vexarDown', lose:'vexarLost' } } ] },

vexarDown: { bg:'A11', who:'V5', place:'The bell tower', title: (s) => s.flags.vexarFreed ? 'Fire, Given' : 'The Answer, Silenced',
  text: (s) => s.flags.vexarFreed ? [
    'You do not breathe on him to hurt him. You breathe on the chains, slowly, the way you breathed into Kettle\'s hearth, the way you warmed Hollin house by house.',
    'The iron drinks it, and drinks it, and then, all at once, cannot hold any more. The chains go red, then white, then they are only water running down the tower stairs.',
    'Vexar stands up. He has never stood up without chains before. He does not know what to do with his wings.',
    '"Brother," he says. He is trying the word out. It seems to fit.',
  ] : [
    'Vexar goes down across the bell, and the bell rings one last time, cracked and terrible.',
    'He is alive. The chains are not broken, but he tears free of the beams, and with one long look at you he throws himself from the tower and flies north, badly, into the dark.',
    'You will see him again. You are not sure which of you that thought frightens.',
  ],
  choices:[ { t:'Turn to the High Warden', fx:(s) => s.flags.vexarFreed ? { hope:12, ach:'brother', flags:{ vexar:'freed' } } : { dread:6, flags:{ vexar:'fled' } }, go:'ysolde' } ] },
vexarLost: { bg:'A11', who:'V5', place:'The bell tower', title:'Cold Fire',
  text:['The cold fire takes you full in the chest and you crash through the tower roof into the snow below.','When you climb back up, the tower is empty. Vexar is gone north. Ysolde Marr stands alone under the bell, as if waiting.'],
  choices:[ { t:'Face her', fx:{ flags:{ vexar:'fled' }, hope:-4 }, go:'ysolde' } ] },

ysolde: { bg:'A11', who:'P5', place:'The bell tower', title:'The Last of the Quench',
  text:[
    'Ysolde Marr has not moved. She has no lance, no chains, no dragon. Just a lantern, and the cracked bell over her head.',
    '"Well?" she says. "Finish it. That is what fire does."',
  ],
  choices:[
    { t:'Spare her', h:'Let her live with what she did.', fx:{ hope:8, ach:'mercy2', flags:{ ysolde:'spared' } },
      out:['"No," you say, and walk past her to the window. Behind you, after a long time, you hear her sit down on the tower floor.','Aurelia finds her there in the morning. What they say to each other, nobody else hears.'], go:'ch2end' },
    { t:'Exile her north', fx:{ hope:3, dread:4, flags:{ ysolde:'exiled' } },
      out:['She walks out of the Grey Hold at dawn with nothing but her lantern, into the winter she spent her life defending. Nobody follows her.'], go:'ch2end' },
    { t:'Do what fire does', fx:{ dread:14, wild:8, flags:{ ysolde:'burned' } },
      out:['The bell tower burns for three days. When it is done, there is no bell, no tower and no High Warden. The north will never forget it, and it will never stop being afraid of you.'], go:'ch2end' },
  ] },

ch2end: { bg:'A7', place:'The Grey Hold', title:'The Bell Falls Silent',
  text: (s) => [
    'The Grey Hold is yours. In its cellars you find the Quench\'s treasury, and in the treasury, gold. Chests of it, cold, untouched for three hundred years.',
    'Every coin is stamped with the same mark: an open book, and a quill. The seal of the Ledger of Veyrmark, far in the south, where they still say that every coin in the realm was once a dragon\'s.',
    s.flags.vexar === 'freed' ? 'Vexar picks up one coin and holds it until it is warm. "Our mother\'s," he says. "Some of these are hers. I can feel it."' : 'One coin, when you touch it, hums. Faintly. Like something trying to remember its name.',
    'The winter is breaking. The south is waiting.',
  ],
  choices:[ { t:'End of chapter two', fx:{ ach:'bell' }, go:'end' } ] },
});
