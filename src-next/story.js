/* ═══════════ CHAPTER ONE · THE THAW ═══════════
   Scene format: { bg, who, place, title, text:[] | fn, choices:[{ t, h, req, fx, out, go, fight }] }
   go: scene id | 'map' | 'create' | 'lair' | 'season' | 'end'      fight: { enc, win, lose }       */
const SCENES = {

/* ── Opening ── */
egg: { bg:'A1', place:'The Spring', title:'The Last Egg',
  text:[
    'The egg has been cooling for three hundred years.',
    'Then a hot spring shifts under the mountain, a stone cracks, and something inside remembers how to burn.',
  ],
  choices:[ { t:'Break the shell', go:'create' } ] },

firstWarmth: { bg:'A1', place:'The Spring', title:'Water, Running',
  text: (s) => [
    `You break the shell to a sound no one in Emberveld has heard in living memory: water, running.`,
    `All around your small, steaming body the snow is going soft. Icicles at the cave mouth drip, then fall. You open your jaws for the first time and a thread of ${ {fire:'flame', shadow:'black fire', gold:'molten gold', fluid:'scalding steam'}[s.look.element] } comes out, thin as a candle and twice as surprised.`,
    `Far to the north, in a hall of grey ice, a bell begins to ring.`,
    `Closer, much closer, something with white fur and too many teeth has smelled the warmth.`,
  ],
  choices:[ { t:'Face it', h:'Your first fight', fight:{ enc:'pup', win:'afterPup', lose:'afterPup' } } ] },

afterPup: { bg:'A1', place:'The Spring', title:'A Lair, Of Sorts',
  text:[
    'The wolf runs, or does not run anymore. Either way, the spring is yours.',
    'You learn three things before the first night is out. Gold, even a little, stays warm long after you have breathed on it. Warmth spreads from wherever you sleep, further the more you hoard. And outside the reach of that warmth, the world is dying of cold.',
    'You can fly three times before the season turns. Use them well.',
  ],
  choices:[ { t:'Look out over Emberveld', fx:{ ach:'hatch', note:'The map is open' }, go:'map' } ] },

/* ── The Warren ── */
warren: { bg:'A5', who:'P1', place:'The Warren', title:'A Kneeling Warren',
  text:[
    'They come up out of the rock in a line: forty goblins in mismatched furs, carrying a chair. On the chair sits the oldest goblin you have ever seen, which is also the only goblin you have ever seen.',
    '"Old Gnash," he says, and points at himself in case it was unclear. "We felt you wake. The rock got warm. The rock has not been warm since my grandmother\'s grandmother."',
    'Behind him a thin goblin with cracked spectacles is writing everything down in a little book. He looks up, sees you looking, and drops the quill.',
    '"We are here," says Old Gnash, "to negotiate."',
  ],
  choices:[
    { t:'Take them under your wing', h:'Allies. They will dig for you.', fx:{ flags:{ goblins:'allied' }, hope:4, done:'warren' },
      out:['Old Gnash bows so low his chair tips over. The warren cheers. Someone starts a song with no tune and a great many verses about your teeth.','"Snikkit," says Gnash to the spectacled one, "write down that we are allies." Snikkit writes it down. Then he underlines it twice.'] },
    { t:'Demand tribute', h:'More gold, less love.', fx:{ flags:{ goblins:'vassal' }, gold:20, dread:6, done:'warren' },
      out:['Old Gnash nods slowly, like a goblin who has paid tribute to worse things than you and outlived all of them.','A sack of rough gold nuggets appears. It is warm in your claws by the time they have backed away.'] },
    { t:'Lunge at the one with the spectacles', h:'They will never forget it.', fx:{ flags:{ goblins:'terrified' }, gold:30, dread:12, wild:8, done:'warren' },
      out:['Snikkit faints. Old Gnash does not. He simply holds up a bag of gold, roughly the weight of a spectacled nephew, and keeps holding it until you take it.','The warren will serve you. It will also never, ever turn its back on you.'] },
  ] },

snikkit: { bg:'A5', who:'P2', place:'The Warren', title:'Fiscal Responsibility',
  text:[
    'Snikkit arrives with his ledger, three quills and an abacus that is mostly rat bones.',
    '"With respect, great one," he says, not looking at your teeth, "your hoard is a heap. A heap is not a hoard. A hoard is counted. A counted hoard stays warmer, everyone knows that."',
    'Nobody knows that. You suspect he has just made it up. You also suspect he is right.',
  ],
  choices:[
    { t:'Let him count it', fx:{ gold:15, done:'snikkit', flags:{ steward:true }, ach:'steward' },
      out:['Snikkit counts for two days without sleeping. He finds coins under coins. He finds a ring you did not know you had. He finds, somehow, fifteen more gold than there was.','"Rounding," he says, and will not elaborate.'] },
    { t:'Tell him the heap is fine', fx:{ done:'snikkit', wild:3 },
      out:['Snikkit closes his ledger with the expression of a goblin watching a fire burn down an unpaid bill.'] },
  ] },

/* ── Kettle ── */
kettle: { bg:'A4', place:'Kettle', title:'Forty Chimneys, Nine Smoking',
  text:[
    'Kettle is a ring of low stone huts around a frozen well. When your shadow crosses it, every door slams except one.',
    'An old woman stands in that doorway with a lantern. Behind her, in the village hall, a great hearth sits cold. There is ice on the inside of the chimney.',
    '"If you have come to eat us," she says, "start with the mayor. He has been hoarding the firewood."',
  ],
  choices:[
    { t:'Breathe into their hearth', h:'Kindle the village. It will survive the winter.', fx:{ kindle:'kettle', hope:12, done:'kettle' },
      out:['You put your head through the hall door, which is not easy, and breathe.','The hearth catches. Then the chimney. Then, somehow, the stones of the floor. By nightfall the whole village is standing in the hall in their shirtsleeves, crying, and the mayor is handing out firewood.'] },
    { t:'Warm them, for a price', h:'Kindle the village, take a tithe.', fx:{ kindle:'kettle', gold:15, hope:4, dread:5, done:'kettle' },
      out:['The hearth roars. The tithe is paid in candlesticks, a silver spoon and the mayor\'s good belt buckle.','They are grateful. They are also counting, and they will remember what warmth costs.'] },
    { t:'Take a goat and go', h:'Food. Nothing else.', fx:{ hp:12, wild:5, dread:7, done:'kettle' },
      out:['The goat is delicious. The village stays cold.','The old woman watches you go. She does not close her door until you are out of sight.'] },
  ] },

kettleWinter: { bg:'A4', place:'Kettle', title:'The Winter Feast',
  text:[
    'Kettle has not had a winter feast in living memory. It is not sure how they go. It has decided they involve every candle in the village and a song about you that rhymes "scales" with "scales".',
    'They have saved you the best seat, which is the roof.',
  ],
  choices:[
    { t:'Accept their offering', fx:{ gold:12, hope:4, hp:10, done:'kettleWinter' }, out:['Ham, ale, a cart of copper pots. You eat the ham. You keep the pots. Both are warm by morning.'] },
    { t:'Ask them to send food west, to the others', fx:{ hope:10, done:'kettleWinter' }, out:['They load two sledges for the far villages before the feast is over. When they toast you, they mean it.'] },
  ] },

/* ── Wolf Pines ── */
pines: { bg:'A8', place:'Wolf Pines', title:'Hunting Ground',
  text: (s) => s.season >= 2 ? [
    'The pack has doubled since the thaw. Hungry wolves came down from the north, following the smell of warm meat. Your warmth is drawing everything in Emberveld towards it, good and bad.',
  ] : [
    'Frost wolves hunt the edges of your warmth, waiting for anything that strays out of it. Tonight, that includes you.',
  ],
  choices:[
    { t:'Hunt them', fight:{ enc:'__pines', win:'pinesWin', lose:'defeat' } },
    { t:'Leave them be', h:'You keep the flight.', go:'map', refund:true },
  ] },
pinesWin: { bg:'A8', place:'Wolf Pines', title:'Well Fed',
  text:['The pack scatters into the dark. What is left of the slow ones feeds you for a week.','You can feel yourself growing on it.'],
  choices:[ { t:'Fly home', fx:{ maxHp:4, hp:10, wild:2 } } ] },

/* ── Mirelle ── */
hut: { bg:'A6', who:'P3', place:"Mirelle's Hut", title:'Somebody Who Remembers',
  text:[
    'The door opens before you land. An old woman in four shawls looks up at you, then further up, and smiles like someone being handed back something she lost.',
    '"Three hundred years," says Mirelle. "I kept the light on."',
    'Inside, on the table, a single dragon scale smoulders in a bowl of sand. It is the only fire for twenty miles. It is the colour of your own.',
    '"Your kind were the hearth of the world," she says. "The Quench called fire a sin and drowned you in the Lake of Ash. The winter came the next year and never quite left. Gold remembers fire. That is why your kind hoarded it. Not greed. Warmth." She looks at the scale. "Mostly warmth."',
  ],
  choices:[
    { t:'Take the ember scale', h:'Your warmth reaches further (+5 range).', fx:{ flags:{ ember:true }, done:'hut', ach:'ember' },
      out:['The scale settles into your hoard like it has always been there. The warmth around your spring pushes out, a full mile in one night.','"It was your mother\'s," Mirelle says, after you have taken it.'] },
    { t:'Ask for her ward', h:'Start every fight shielded.', fx:{ flags:{ ward:true }, done:'hut' },
      out:['She paints a sign on your chest in soot and spit. It itches. It will also, she promises, turn the first blow of every fight.'] },
    { t:'Ask about the bell in the north', h:'Knowledge. A calmer mind.', fx:{ flags:{ knowsVexar:true }, wild:-8, hope:3, done:'hut' },
      out:['"The Grey Hold," she says. "The Quench rang that bell the day they drowned the last of you. They ring it again now because they know you are here."','She hesitates. "There is a story that they kept one egg. That they hatched it in the dark and raised it on cold water and chains. I hope it is only a story."'] },
  ] },

/* ── Ashby ── */
ashby: { bg:'A9', place:'Ashby', title:'Riders at the Ford',
  text:[
    'Five riders in grey ice-steel have the villagers of Ashby lined up on the frozen river. One of them, in a tall helm with a narrow visor, is asking questions.',
    '"A warmth, in the south. Snow melting in the wrong season. Someone here has seen something."',
    'Nobody here has seen anything. Then they look up and see you.',
  ],
  choices:[
    { t:'Drive them off', h:'A knight of the Quench.', fight:{ enc:'patrol', win:'ashbyWin', lose:'defeat' } },
    { t:'Stay in the clouds and watch', h:'They leave. Ashby stays cold.', fx:{ done:'ashby', dread:-2 },
      out:['The riders search the village, take two sacks of grain for their trouble and ride north before dark.','Ashby saw you. Ashby will talk.'] },
  ] },
ashbyWin: { bg:'A9', place:'Ashby', title:'A Knight on the Ice',
  text:[
    'The others fled. The knight did not, which says something about the knight. Now he lies on the cracked ice with his lance in two pieces, looking up at you through his visor.',
    '"Do it, then," he says. "Fire-thing."',
    'Ashby is watching.',
  ],
  choices:[
    { t:'Spare him', fx:{ hope:8, flags:{ spared:true }, done:'ashby', ach:'merciful' },
      out:['You step back. It takes the knight a long time to understand. When he does, he takes off his helm, and he is younger than you expected.','He walks north without his horse. Ashby talks about it for years.'] },
    { t:'Devour him', fx:{ dread:10, wild:6, hp:15, done:'ashby' },
      out:['Ashby will not forget the sound. Neither will the Quench.'] },
    { t:'Send him home with a message', fx:{ dread:5, flags:{ message:true }, done:'ashby' },
      out:['You breathe a ring of fire into the ice around him and let him go. He will tell the Grey Hold exactly what he saw.','That is the message.'] },
  ] },
ashbyKindle: { bg:'A9', place:'Ashby', title:'The Frozen Ford',
  text:['Ashby\'s ferry has been locked in the ice for nine years. The village sits beside it, waiting for a spring that never quite comes.'],
  choices:[
    { t:'Breathe on the river', h:'Kindle the village.', fx:{ kindle:'ashby', hope:10 },
      out:['The ice groans, cracks, and lets go. By evening the ferry is moving for the first time in nine years, and the ferryman is too stunned to charge anyone.'] },
    { t:'Not now', go:'map', refund:true },
  ] },

/* ── Hollin ── */
hollin: { bg:'A4', place:'Hollin', title:'Fewer Chimneys Every Week',
  text:[
    'Hollin is too far from your spring to feel it. The snow here is up to the windows. Children watch you land from the roof of the grain store, which is empty.',
    'If anything in this village is going to live through the winter, it will need a fire of its own.',
  ],
  choices:[
    { t:'Kindle every hearth in Hollin', h:'It will survive the winter.', fx:{ kindle:'hollin', hope:12 },
      out:['It takes all night. You go from house to house, breathing into one cold hearth after another, while the village follows you with buckets of snow in case you overdo it.','You do not overdo it. Mostly.'] },
    { t:'There is not enough of you. Not now.', go:'map', refund:true },
  ] },

/* ── Season openings ── */
summer: { bg:'A3', who:'P2', place:'The Spring', title:'Six Weeks of Summer',
  text: (s) => [
    `Summer lasts six weeks in Emberveld. This year it lasts a little longer around your spring, and everybody notices.`,
    s.flags.goblins ? `Snikkit comes up from the warren with news, read from a ledger: "Two villages beyond your warmth. Hollin, far to the north-east. Ashby, at the ford. Riders in grey asking questions at Ashby. And a light in the western woods, where there has been no light for as long as there have been goblins."` : `The goblins leave a note at your cave, written in charcoal on a door: "VILAGES. HOLIN NORTH-EAST. ASHBY FORD. GRAY RIDERS. ALSO A LITE IN THE WEST WOODS."`,
    `Winter is two seasons away. Whatever is outside your warmth when it comes will not see the spring.`,
  ],
  choices:[ { t:'Fly', go:'map' } ] },

ashfall: { bg:'A3', place:'The Spring', title:'Ashfall',
  text: (s) => [
    'Ash drifts down from your mountain and mixes with the first snow. The goblins call it ashfall. Everyone else calls it the last warning.',
    'You are bigger now. Your wings block the cave mouth when you stretch. Your breath melts stone.',
    s.flags.message || s.flags.spared ? 'And the Quench is coming. Not a patrol this time.' : 'And far to the north, the bell of the Grey Hold rings again. Closer, somehow.',
  ],
  choices:[ { t:'Fly', go:'map' } ] },

raid: { bg:'A4', who:'P4', place:'Raid', title:'The Quench Comes South',
  text: (s) => [
    `They come at dawn: a knight in ice-steel and a warden in grey robes with chains around her arms, and behind them a novice with a lantern, a girl of maybe twenty, snow in her dark hair.`,
    `They are not here for ${s.places.kettle === 'kindled' ? 'Kettle' : 'the warren'}. They are here for you.`,
    `"In the name of the Quench," the warden calls, "we come to put out the fire."`,
  ],
  choices:[ { t:'Show them fire', fight:{ enc:'raid', win:'raidWin', lose:'raidLost' } } ] },
raidWin: { bg:'A4', who:'P4', place:'After the Raid', title:'The Girl With the Lantern',
  text:[
    'The knight runs. The warden is carried. The novice does not move at all. She is staring at the ground between her boots.',
    'There is grass there. Green grass, under the melted snow.',
    '"I have never seen it," she says, to nobody. Then, to you: "I am Aurelia Marr. My mother is the High Warden of the Quench. She will send more."',
  ],
  choices:[
    { t:'Let her go', fx:{ hope:6, flags:{ aurelia:'free' }, ach:'free' },
      out:['She takes a handful of the grass with her. She does not say thank you. She does look back, twice.'] },
    { t:'Keep her as a guest', h:'A hostage, politely.', fx:{ dread:6, gold:25, flags:{ aurelia:'held' } },
      out:['The Quench pays a ransom in silver before the week is out, with a letter that says the money is "for her keep". Aurelia stays anyway, by her own choice, to see what spring looks like.','Snikkit gives her a ledger of her own.'] },
    { t:'Ask her about the Grey Hold', fx:{ flags:{ aurelia:'free', knowsVexar:true }, hope:3 },
      out:['"They have a dragon," she says. "In the cellars. Blue fire. Cold fire. My mother calls it the Answer. I have heard it crying at night."','Then she walks north, to tell her mother nothing.'] },
  ] },
raidLost: { bg:'A4', place:'After the Raid', title:'Driven Back',
  text:['The chains bite, the water hisses, and you have to retreat to the spring to lick your wounds. The Quench leave satisfied, and they take the goblins\' winter stores with them.'],
  choices:[ { t:'Endure', fx:{ hope:-6, gold:-20 } } ] },

winter: { bg:'A3', place:'The Spring', title:'The Long Winter',
  text: (s) => {
    const lost = VILLAGES.filter(v => s.places[v] === 'lost').map(v => PLACES[v].name);
    return [
      'The frost comes back in one night, the way it always has. It flows down from the north like water and stops, hissing, at the edge of your warmth.',
      lost.length ? `${lost.join(' and ')} ${lost.length > 1 ? 'were' : 'was'} outside it. By morning there is no smoke from ${lost.length > 1 ? 'those chimneys' : 'that chimney'}. Some of the survivors reach your spring. Not all.` : 'Every village in the south is inside it. For the first time in three hundred years, the frost has to go around.',
      'And in the long dark, something big comes down from the pass. You can hear it chewing.',
    ];
  },
  choices:[ { t:'Fly', go:'map' } ] },

/* ── The Grinder ── */
grinderPass: { bg:'A8', place:"Grinder's Pass", title:'The Grinder',
  text:[
    'He comes nose-first, the way trolls always come, stupid with hunger: a hunched mountain of grey-blue hide crusted with rime, dragging a club of solid ice.',
    'The Grinder has hunted the long nights of Emberveld for longer than anyone has been counting. Sunlight turns trolls to stone. In a land without sun, trolls have had it very good.',
    'He sniffs. He smiles. Warm meat.',
    'Dawn is nine hours away.',
  ],
  choices:[ { t:'Fight him', h:'Kill him, or hold him until the sun comes up.', fight:{ enc:'grinder', win:'grinderDead', lose:'grinderLost' } } ] },
grinderAttack: { bg:'A3', place:'The Spring', title:'Knock, Knock',
  text:[
    'You did not go to the Grinder. So the Grinder comes to you, on the last night of winter, following the warmth down the mountain like a dog following a cook.',
    'Dawn is nine hours away.',
  ],
  choices:[ { t:'Fight him', fight:{ enc:'grinder', win:'grinderDead', lose:'grinderLost' } } ] },
grinderDead: { bg:'A8', place:"Grinder's Pass", title:'The Pass Is Open',
  text: (s) => s.flags.dawned ? [
    'The sun comes over the mountains. The Grinder sees it, too late, and raises one huge hand to cover his eyes.',
    'He stays like that. He will stay like that for a thousand years: a troll of grey stone at the top of the pass, shielding his face from the morning.',
    'The goblins come up the next day with chisels and a ladder. By spring he has a hat.',
  ] : [
    'The Grinder goes down like a landslide and does not get up.',
    'In his cave at the top of the pass you find what trolls always hoard: bones, mostly, and under the bones, a century of travellers\' purses.',
  ],
  choices:[ { t:'Go home', fx:(s) => s.flags.dawned ? { hope:8, done:'grinder', ach:'sunrise' } : { gold:60, dread:4, done:'grinder', ach:'slayer' }, go:'ending' } ] },
grinderLost: { bg:'A8', place:"Grinder's Pass", title:'Long Night',
  text: (s) => [
    'The club comes down and the world goes white. When you wake, the Grinder is gone, and so is half a winter of food from the nearest village.',
    s.places.kettle === 'saved' ? 'Kettle will survive. Barely.' : 'Nobody is left to tell you what he took.',
  ],
  choices:[ { t:'Limp home', fx:{ hope:-8, done:'grinder' }, go:'ending' } ] },

/* ── Ending of chapter one ── */
ending: { bg:'A7', who:'V5', place:'The Grey Hold', title:'The Answer',
  text: (s) => [
    'On the first morning of spring, the bell of the Grey Hold rings once, and stops.',
    'Then something flies over the mountains from the north. It is long and pale and steel-blue, and it trails chains from its collar like broken wings. Its breath, when it roars, is blue. The snow it passes over does not melt. It freezes harder.',
    s.flags.knowsVexar ? 'You know what it is. Mirelle told you. Aurelia told you. The Quench did keep an egg.' : 'You do not know what it is. You know it is a dragon. You know it is looking for you.',
    'It circles your mountain once. Then it lands on the pass, folds its wings, and waits.',
  ],
  choices:[ { t:'End of chapter one', go:'end' } ] },

defeat: { bg:'A3', place:'The Spring', title:'Back to the Spring',
  text:['You make it home on one wing and a great deal of stubbornness, and sleep on your hoard until the bleeding stops.','The hoard is a little smaller when you wake. Some of it went into the snow on the way back.'],
  choices:[ { t:'Rest', fx:(s) => ({ hp: Math.round(s.maxHp * .4) - s.hp, gold: -Math.round(s.gold * .15) }) } ] },
};
