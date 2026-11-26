/* ═══════════ CHAPTER ONE · THE THAW ═══════════
   Scene: { bg, who, place, title, text | pages:[{ bg, who, title, text, next }], choices }
   Choice: { t, h, req, hide, fx, out, img, who, go, fight, ask, reply, refund }            */
const BREATH_WORD = { fire:'flame', shadow:'black fire', gold:'molten gold', fluid:'scalding steam' };
const SCENES = {

/* ── Opening ── */
egg: { place:'The Spring', title:'The Last Egg',
  pages:[
    { bg:'C01', text:[
      'Dark. Warm water, then cold water, then warm again, for longer than anything has ever been anything.',
      'The egg has been cooling for three hundred years. It has forgotten it was ever an egg.',
      'Then a hot spring shifts under the mountain. A stone cracks. Light comes in through the crack, orange and impossible, and something inside remembers how to burn.',
    ], next:'Push' },
    { bg:'C01', text:[
      'You push. The shell pushes back.',
      'You push again, with your whole body, which is mostly head, and the world splits open in a burst of steam.',
      'Air. Cold air. You have never felt cold before. You decide at once that you do not like it.',
    ] },
  ],
  choices:[ { t:'Break the shell', go:'create' } ] },

firstWarmth: { place:'The Spring', title:'Water, Running',
  pages:[
    { bg:'C02', text: (s) => [
      'You crawl to the mouth of the cave on legs that do not yet agree with each other. Outside, the whole world is white and silent and dead.',
      `You open your jaws for the first time, mostly to complain, and a thread of ${BREATH_WORD[s.look.element]} comes out. It is thin as a candle and twice as surprised.`,
      'Where it touches, the snow goes soft. An icicle drips. Then another. Then, behind you, a sound no one in Emberveld has heard in living memory: water, running.',
    ] },
    { bg:'C27', text:[
      'Far to the north, in a hall of grey ice, a bell begins to ring. You do not know what a bell is. You know that it is ringing for you.',
      'Closer, much closer, something has smelled the warmth.',
    ] },
    { bg:'C03', text:[
      'It stands in the mouth of your cave: white fur, too many teeth, eyes like two cold coins. A frost wolf, young and thin and very hungry.',
      'It has never seen a dragon. Nobody has. It does not know what you are. It knows you are warm, and small, and alone.',
      'It lowers its head. You lower yours. Neither of you has done this before.',
    ] },
  ],
  choices:[
    { t:'Hiss at it', ask:true, reply:['You hiss. It comes out as a sort of squeak with smoke in it. The wolf\'s ears go back, then forward again. It is not impressed. It is, if anything, hungrier.'] },
    { t:'Face it', h:'Your first fight', fight:{ enc:'pup', win:'afterPup', lose:'afterPup' } },
  ] },

afterPup: { place:'The Spring', title:'A Lair, Of Sorts',
  pages:[
    { bg:'C04', text:[
      'The wolf yelps, spins and bolts into the pines with its tail between its legs and its fur smoking. Twice it looks back over its shoulder. You stand very tall in the cave mouth, which is not very tall at all.',
      'Somewhere in the forest, the whole pack hears it howl. They will remember the smell of you.',
    ] },
    { bg:'C05', text:[
      'You learn three things before the first night is out.',
      'Gold, even a little, stays warm long after you have breathed on it. There are three old coins at the bottom of your spring, and they glow when you sleep on them.',
      'Warmth spreads from wherever you sleep, further the more you hoard. And outside the reach of that warmth, the world is dying of cold.',
      'You can fly three times before the season turns. Use them well.',
    ] },
  ],
  choices:[ { t:'Look out over Emberveld', fx:{ ach:'hatch', note:'The map is open' }, go:'map' } ] },

/* ── The Warren ── */
warren: { place:'The Warren', title:'A Kneeling Warren',
  pages:[
    { bg:'C06', text:[
      'They come up out of the rock in a line: forty goblins in mismatched furs, carrying torches, carrying spears, carrying a chair.',
      'On the chair sits the oldest goblin you have ever seen, which is also the only goblin you have ever seen. He is wearing a crown made of bones and bottle caps, and he is the only one of them not shaking.',
      'The procession stops at a very respectful distance. Then it takes three more steps back, for luck.',
    ] },
    { bg:'A5', who:'P1', text:[
      '"Old Gnash," says the old goblin, and points at himself in case it was unclear. "Chief of the Warren, Keeper of the Deep Stair, Victor of the Mushroom War. Mostly."',
      '"We felt you wake. The rock got warm. The rock has not been warm since my grandmother\'s grandmother." He leans forward. "So. You are a dragon."',
      'Behind him, a thin goblin with cracked spectacles is writing everything down in a little book. He looks up, sees you looking, and drops the quill.',
      '"We are here," says Old Gnash, "to negotiate."',
    ] },
  ],
  choices:[
    { t:'"What is there to negotiate?"', ask:true, reply:['"Everything," says Old Gnash happily. "Who digs. Who eats. Who gets eaten. We find it best to settle that last one early."','"We have tunnels, we have hands, we have a very small amount of gold. You have fire. Fire is the thing we do not have. So."'] },
    { t:'"Who is the one with the book?"', ask:true, reply:['"That is Snikkit," says Old Gnash. "My nephew. He can count."','"Up to very high numbers," says Snikkit, from behind the chair.','"He is writing down everything you say, so that if you eat us, there will be a record."','"For posterity," says Snikkit.'] },
    { t:'"What happened to the other dragons?"', ask:true, reply:['The goblins go very quiet. Old Gnash looks at his hands.','"The grey people drowned them," he says at last. "In the Lake of Ash, three hundred years ago. My grandmother\'s grandmother saw the steam from the top of the mountain. She said it rose for a week."','"And then it got cold," says Snikkit softly. "And it never stopped."'] },
    { t:'Take them under your wing', h:'Allies. They will dig for you.', fx:{ flags:{ goblins:'allied' }, hope:4, done:'warren' }, img:'C08',
      out:['Old Gnash bows so low his chair tips over. The warren cheers. Someone starts a song with no tune and a great many verses about your teeth.','"Snikkit," says Gnash from the floor, "write down that we are allies." Snikkit writes it down. Then he underlines it twice. Then he draws a small, slightly inaccurate dragon next to it.'] },
    { t:'Demand tribute', h:'More gold, less love.', fx:{ flags:{ goblins:'vassal' }, gold:20, dread:6, done:'warren' }, img:'C09',
      out:['Old Gnash nods slowly, like a goblin who has paid tribute to worse things than you and outlived all of them.','A sack of rough gold nuggets is placed in the snow. Forty goblins walk backwards into the rock, very carefully, not turning around. By the time you pick it up, the gold is warm.'] },
    { t:'Lunge at the one with the spectacles', h:'They will never forget it.', fx:{ flags:{ goblins:'terrified' }, gold:30, dread:12, wild:8, done:'warren' }, img:'C09',
      out:['Snikkit faints. Old Gnash does not. He simply holds up a bag of gold, roughly the weight of a spectacled nephew, and keeps holding it until you take it.','"Rounding," he says. The warren will serve you. It will also never, ever turn its back on you.'] },
  ] },

snikkit: { bg:'A5', who:'P2', place:'The Warren', title:'Fiscal Responsibility',
  pages:[
    { text:[
      'Snikkit arrives with his ledger, three quills and an abacus that is mostly rat bones. He has written a speech. You can tell because he is reading it.',
      '"With respect, great one," he says, not looking at your teeth, "your hoard is a heap. A heap is not a hoard. A hoard is counted. A counted hoard stays warmer, everyone knows that."',
      'Nobody knows that. You suspect he has just made it up. You also suspect he is right.',
    ] },
  ],
  choices:[
    { t:'"How do you know gold stays warmer?"', ask:true, reply:['"I measured it," says Snikkit. "With my hands. For a week." He shows you his hands. They are slightly singed.','"Counted coins lie flat. Flat coins touch. Touching coins share heat. It is," he pushes his spectacles up, "basically mathematics."'] },
    { t:'Let him count it', fx:{ gold:15, done:'snikkit', flags:{ steward:true }, ach:'steward' },
      out:['Snikkit counts for two days without sleeping. He finds coins under coins. He finds a ring you did not know you had. He finds, somehow, fifteen more gold than there was.','"Rounding," he says, and will not elaborate. From then on he sleeps in a little hollow at the edge of your hoard, with his ledger for a pillow.'] },
    { t:'Tell him the heap is fine', fx:{ done:'snikkit', wild:3 },
      out:['Snikkit closes his ledger with the expression of a goblin watching a fire burn down an unpaid bill.'] },
  ] },

/* ── Kettle ── */
kettle: { place:'Kettle', title:'Forty Chimneys, Nine Smoking',
  pages:[
    { bg:'C10', text:[
      'Kettle is a ring of low stone huts around a frozen well. When your shadow crosses it, every door in the village slams. All but one.',
      'An old woman stands in that doorway with a lantern held high, as if a lantern were any use against a dragon. Her hands do not shake. Her voice does, a little.',
    ] },
    { bg:'C10', who:'P9', text:[
      '"Edda," she says. "I am the oldest, so I am the one who gets eaten first. That is the rule."',
      '"If you have come to eat us, I would start with the mayor. He has been hoarding the firewood. He is also the fattest."',
      'From behind a shutter somewhere, a man\'s voice says, "Edda!"',
    ] },
  ],
  choices:[
    { t:'"I am not here to eat anyone."', ask:true, reply:['"Hm," says Edda. "That is what the wolves say, right before."','She looks at you for a long time. "You are warm," she says. "I can feel it from here. Like standing near a hearth." Something in her face crumples, very briefly. "We have not had a fire in the hall since my husband died. Seven winters."'] },
    { t:'"Show me your hearth."', ask:true, img:'C11', reply:['She leads you to the village hall. The great hearth inside is big enough to roast an ox, and it is cold. There is ice on the inside of the chimney. There is frost on the benches where people used to sit.','"We burn what we can find in the houses," Edda says. "Doors, mostly. And chairs. We are running out of chairs."'] },
    { t:'Breathe into their hearth', h:'Kindle the village. It will survive the winter.', fx:{ kindle:'kettle', hope:12, done:'kettle' }, img:'C12', who:'P9',
      out:['You put your head through the hall door, which is not easy, and breathe.','The hearth catches. Then the chimney. Then, somehow, the stones of the floor. Ice runs down the walls in streams. By nightfall the whole village is standing in the hall in their shirtsleeves, crying, and the mayor is handing out firewood.','"Well," says Edda, wiping her eyes with her shawl. "That is a rule I will have to change."'] },
    { t:'Warm them, for a price', h:'Kindle the village, take a tithe.', fx:{ kindle:'kettle', gold:15, hope:4, dread:5, done:'kettle' }, img:'C12', who:'P9',
      out:['The hearth roars. The tithe is paid in candlesticks, a silver spoon and the mayor\'s good belt buckle.','"Fair," says Edda, and you can tell she means it. "Fire was never free. At least yours is honest about it."'] },
    { t:'Take a goat and go', h:'Food. Nothing else.', fx:{ hp:12, wild:5, dread:7, done:'kettle' }, img:'C13',
      out:['The goat is delicious. The village stays cold.','Edda watches you go. She does not close her door until you are out of sight. Then she goes back inside and breaks up another chair.'] },
  ] },

kettleWinter: { bg:'C12', who:'P9', place:'Kettle', title:'The Winter Feast',
  text:[
    'Kettle has not had a winter feast in living memory. It is not sure how they go. It has decided they involve every candle in the village, a whole sheep and a song about you that rhymes "scales" with "scales".',
    '"We saved you the best seat," says Edda, and points at the roof.',
  ],
  choices:[
    { t:'Accept their offering', fx:{ gold:12, hope:4, hp:10, done:'kettleWinter' }, out:['Ham, ale, a cart of copper pots. You eat the ham. You keep the pots. Both are warm by morning.'] },
    { t:'Ask them to send food to the other villages', fx:{ hope:10, done:'kettleWinter' }, out:['They load two sledges for the far villages before the feast is over. When they toast you, they mean it. Edda makes the mayor pull the first sledge.'] },
  ] },

/* ── Wolf Pines ── */
pines: { place:'Wolf Pines', title:'Hunting Ground',
  pages: (s) => [
    { bg:'C14', text: s.season >= 2 ? [
      'The pack has doubled since the thaw. Hungry wolves have come down from the north, following the smell of warm meat. Your warmth is drawing everything in Emberveld towards it, good and bad.',
      'Between the black pines, a dozen pale eyes open at once.',
    ] : [
      'The pines here grow so close that the snow never reaches the ground. It is dark under the branches, and quiet, and the quiet is listening to you.',
      'Then, between the trunks, eyes. Two. Six. Ten. Pale blue and patient.',
      'One of them has a scorched patch on its fur. It remembers you.',
    ] },
  ],
  choices:[
    { t:'Hunt them', fight:{ enc:'__pines', win:'pinesWin', lose:'defeat' } },
    { t:'Leave them be', h:'You keep the flight.', go:'map', refund:true },
  ] },
pinesWin: { bg:'C15', place:'Wolf Pines', title:'Well Fed',
  text:['The pack breaks and scatters across the moonlit snowfield, running flat out, not one of them looking back.','What is left of the slow ones feeds you for a week. You can feel yourself growing on it: your bones aching at night, your scales pushing out, your breath coming hotter.'],
  choices:[ { t:'Fly home', fx:{ maxHp:4, hp:10, wild:2 } } ] },

/* ── Mirelle ── */
hut: { place:"Mirelle's Hut", title:'Somebody Who Remembers',
  pages:[
    { bg:'A6', text:[
      'A single warm window in the western woods, where no warm window should be. Smoke from the chimney. The smell of bread.',
      'The door opens before you land. An old woman in four shawls looks up at you, then further up, and smiles like someone being handed back something she lost.',
    ] },
    { bg:'C16', who:'P3', text:[
      '"Three hundred years," says Mirelle. "I kept the light on."',
      'Inside, on the table, a single dragon scale smoulders in a bowl of sand. It is the only fire for twenty miles. It is the colour of your own.',
      '"Sit," she says. "Well. Lie down. Mind the herbs."',
    ] },
  ],
  choices:[
    { t:'"Who are you?"', ask:true, reply:['"Mirelle. A witch, they would say in the villages. A friend of dragons, I would say. The same thing, these days."','"I was young when they drowned your kind. I was there. I stole one scale from the shore before the Quench saw me." She looks at it. "I have been keeping it warm ever since. Waiting for something to give it back to."'] },
    { t:'"What happened at the Lake of Ash?"', ask:true, img:'C17', reply:['Mirelle is quiet for a long time.','"The Quench called fire a sin. They said the winter was punishment for it. So they took the dragons, one by one, with chains and water and prayers, and drowned them in the lake under the Grey Hold. The steam rose for a week."','"The next year, the winter came, and it never quite left. They told everyone it was the last of the dragons\' wickedness, still in the world." She snorts. "It was the absence of them."'] },
    { t:'"Why do dragons hoard gold?"', ask:true, reply:['"Ah." Mirelle smiles. "Everyone thinks it is greed."','"Gold remembers fire. Breathe on it, and it stays warm for a hundred years. A dragon\'s hoard was never a treasure. It was a hearth. The bigger the hoard, the warmer the valley."','"Mostly," she adds. "Some of them were also greedy."'] },
    { t:'Take the ember scale', h:'Your warmth reaches further (+5 range).', fx:{ flags:{ ember:true }, done:'hut', ach:'ember' },
      out:['The scale settles into your hoard like it has always been there. The warmth around your spring pushes out, a full mile in one night.','"It was your mother\'s," Mirelle says, after you have taken it.'] },
    { t:'Ask for her ward', h:'Start every fight shielded.', fx:{ flags:{ ward:true }, done:'hut' },
      out:['She paints a sign on your chest in soot and spit. It itches. It will also, she promises, turn the first blow of every fight.'] },
    { t:'Ask about the bell in the north', h:'Knowledge. A calmer mind.', fx:{ flags:{ knowsVexar:true }, wild:-8, hope:3, done:'hut' },
      out:['"The Grey Hold," she says. "The Quench rang that bell the day they drowned the last of you. They ring it again now because they know you are here."','She hesitates. "There is a story that they kept one egg. That they hatched it in the dark and raised it on cold water and chains. I hope it is only a story."'] },
  ] },

/* ── Ashby ── */
ashby: { place:'Ashby', title:'Riders at the Ford',
  pages:[
    { bg:'C18', text:[
      'Five riders in grey ice-steel have the villagers of Ashby lined up on the frozen river. Their banners show a candle with no flame.',
      'One of them, in a tall helm with a narrow visor, rides slowly down the line. "A warmth, in the south. Snow melting in the wrong season. Wolves running from something. Someone here has seen something."',
      'Nobody here has seen anything. Then a child looks up, and points, and they all see you.',
    ] },
  ],
  choices:[
    { t:'Drive them off', h:'A knight of the Quench.', fight:{ enc:'patrol', win:'ashbyWin', lose:'defeat' } },
    { t:'Stay in the clouds and watch', h:'They leave. Ashby stays cold.', fx:{ done:'ashby', dread:-2 },
      out:['The riders search the village, take two sacks of grain for their trouble and ride north before dark.','Ashby saw you. Ashby will talk.'] },
  ] },
ashbyWin: { place:'Ashby', title:'A Knight on the Ice',
  pages:[
    { bg:'C19', text:[
      'The others fled. The knight did not, which says something about the knight. Now he lies on the cracked ice with his lance in two pieces.',
      'He pushes up his visor. Under it is a face younger than you expected, white with fear and trying very hard not to be.',
    ] },
    { bg:'C19', who:'P10', text:[
      '"Ser Aldric of the Quench," he says. "Fourth company. I would get up, but I think the ice would not like it."',
      '"Do it, then. Fire-thing. They told us you would."',
      'Ashby is watching. All of it.',
    ] },
  ],
  choices:[
    { t:'"Why do you hate fire?"', ask:true, reply:['"It is in the Book," says Aldric automatically. "Fire is the first sin. The cold is our penance."','He looks at the steam rising around him, at the water running under the cracked ice, at the villagers with colour in their faces for the first time in years. "That is what it says," he says, less certainly.'] },
    { t:'"Who sent you?"', ask:true, reply:['"High Warden Ysolde Marr. The bell rang the night you hatched. She has not slept since."','"She keeps something in the cellars," he adds, before he can stop himself. "Something that cries at night. We are not supposed to talk about it."'], fx:{ flags:{ knowsVexar:true } } },
    { t:'Spare him', fx:{ hope:8, flags:{ spared:true }, done:'ashby', ach:'merciful' },
      out:['You step back. It takes Aldric a long time to understand. When he does, he stands up, slowly, and takes his helm off entirely, and holds it under his arm like a man in church.','He walks north without his horse. Ashby talks about it for years.'] },
    { t:'Devour him', fx:{ dread:10, wild:6, hp:15, done:'ashby' },
      out:['Ashby will not forget the sound. Neither will the Quench.'] },
    { t:'Send him home with a message', fx:{ dread:5, flags:{ message:true }, done:'ashby' },
      out:['You breathe a ring of fire into the ice around him and let him go. He will tell the Grey Hold exactly what he saw.','That is the message.'] },
  ] },
ashbyKindle: { bg:'C20', place:'Ashby', title:'The Frozen Ford',
  text:['Ashby\'s ferry has been locked in the ice for nine years. The ferryman still oils its ropes every morning, out of habit, or hope.'],
  choices:[
    { t:'Breathe on the river', h:'Kindle the village.', fx:{ kindle:'ashby', hope:10 }, img:'C20',
      out:['The ice groans, cracks, and lets go. By evening the ferry is moving for the first time in nine years, and the ferryman is too stunned to charge anyone.','He charges them the next day, though. Double.'] },
    { t:'Not now', go:'map', refund:true },
  ] },

/* ── Hollin ── */
hollin: { place:'Hollin', title:'Fewer Chimneys Every Week',
  pages:[
    { bg:'C21', text:[
      'Hollin is too far from your spring to feel it. The snow here is up to the windows. Children watch you land from the roof of the grain store, which is empty.',
      'One of them, a girl with a scarf over her mouth, climbs down and walks right up to you. She holds out her hands, the way you would to a fire.',
      'If anything in this village is going to live through the winter, it will need a fire of its own.',
    ] },
  ],
  choices:[
    { t:'Kindle every hearth in Hollin', h:'It will survive the winter.', fx:{ kindle:'hollin', hope:12 }, img:'C22',
      out:['It takes all night. You go from house to house, breathing into one cold hearth after another, while the village follows you with buckets of snow in case you overdo it.','You do not overdo it. Mostly. By dawn there is smoke from every chimney, and the girl with the scarf is asleep against your side.'] },
    { t:'There is not enough of you. Not now.', go:'map', refund:true },
  ] },

/* ── Season openings ── */
summer: { place:'The Spring', title:'Six Weeks of Summer',
  pages: (s) => [
    { bg:'C25', text:[
      'Summer lasts six weeks in Emberveld. This year it lasts a little longer around your spring, and everybody notices.',
      'Flowers come up in the snowmelt near your cave. Nobody in Kettle knows their names. Edda says her grandmother would have.',
    ] },
    { bg:'A5', who: s.flags.goblins ? 'P2' : null, text:[
      s.flags.goblins ? 'Snikkit comes up from the warren with news, read from his ledger: "Two villages beyond your warmth. Hollin, far to the north-east. Ashby, at the ford. Riders in grey asking questions at Ashby. And a light in the western woods, where there has been no light for as long as there have been goblins."' : 'The goblins leave a note at your cave, written in charcoal on a door: "VILAGES. HOLIN NORTH-EAST. ASHBY FORD. GRAY RIDERS. ALSO A LITE IN THE WEST WOODS."',
      'Winter is two seasons away. Whatever is outside your warmth when it comes will not see the spring.',
    ] },
  ],
  choices:[ { t:'Fly', go:'map' } ] },

ashfall: { place:'The Spring', title:'Ashfall',
  pages: (s) => [
    { bg:'C26', text:[
      'Ash drifts down from your mountain and mixes with the first snow. The goblins call it ashfall. Everyone else calls it the last warning.',
      'You are bigger now. Your wings block the cave mouth when you stretch. Your breath melts stone.',
    ] },
    { bg:'C23', text:[
      s.flags.message || s.flags.spared ? 'And the Quench is coming. Not a patrol this time. Columns of grey, marching south, with water barrels on carts and chains on their shoulders.' : 'And far to the north, the bell of the Grey Hold rings again. Closer, somehow. Columns of grey are on the move.',
    ] },
  ],
  choices:[ { t:'Fly', go:'map' } ] },

raid: { place:'Raid', title:'The Quench Comes South',
  pages: (s) => [
    { bg:'C23', text:[
      `They come at dawn: a knight in ice-steel and a warden in grey robes with chains around her arms, and behind them a novice with a lantern, a girl of maybe twenty, snow in her dark hair.`,
      `They are not here for ${s.places.kettle === 'kindled' ? 'Kettle' : 'the warren'}. They are here for you.`,
    ] },
    { bg:'A4', who:'P4', text:[
      'The warden raises her chained hands. "In the name of the Quench," she calls, "we come to put out the fire."',
      'Behind her, the girl with the lantern is not looking at you at all. She is looking at the ground, where the snow has melted, with an expression you cannot read.',
    ] },
  ],
  choices:[ { t:'Show them fire', fight:{ enc:'raid', win:'raidWin', lose:'raidLost' } } ] },
raidWin: { place:'After the Raid', title:'The Girl With the Lantern',
  pages:[
    { bg:'C24', text:[
      'The knight runs. The warden is carried. The novice does not move at all. She has knelt down, and taken off one glove, and is touching the ground between her boots.',
      'There is grass there. Green grass, under the melted snow.',
    ] },
    { bg:'A4', who:'P4', text:[
      '"I have never seen it," she says, to nobody. "In the Book it says grass is a sin of the old world. It does not look like a sin."',
      'Then, to you: "I am Aurelia Marr. My mother is the High Warden of the Quench. She will send more. She will send everything."',
    ] },
  ],
  choices:[
    { t:'"Why did you come?"', ask:true, reply:['"Because I was told to," says Aurelia. "Because everyone in the Hold is told to. Because the bell rang and my mother said it was the end of the world."','She looks at the grass again. "It does not look like the end of the world either."'] },
    { t:'Let her go', fx:{ hope:6, flags:{ aurelia:'free' }, ach:'free' },
      out:['She takes a handful of the grass with her, wrapped in her glove. She does not say thank you. She does look back, twice.'] },
    { t:'Keep her as a guest', h:'A hostage, politely.', fx:{ dread:6, gold:25, flags:{ aurelia:'held' } },
      out:['The Quench pays a ransom in silver before the week is out, with a letter that says the money is "for her keep". Aurelia stays anyway, by her own choice, to see what spring looks like.','Snikkit gives her a ledger of her own. She fills it with drawings of grass.'] },
    { t:'Ask her about the Grey Hold', fx:{ flags:{ aurelia:'free', knowsVexar:true }, hope:3 },
      out:['"They have a dragon," she says. "In the cellars. Blue fire. Cold fire. My mother calls it the Answer. I have heard it crying at night."','Then she walks north, to tell her mother nothing.'] },
  ] },
raidLost: { bg:'A4', place:'After the Raid', title:'Driven Back',
  text:['The chains bite, the water hisses, and you have to retreat to the spring to lick your wounds. The Quench leave satisfied, and they take the goblins\' winter stores with them.'],
  choices:[ { t:'Endure', fx:{ hope:-6, gold:-20 } } ] },

winter: { place:'The Spring', title:'The Long Winter',
  pages: (s) => {
    const lost = VILLAGES.filter(v => s.places[v] === 'lost').map(v => PLACES[v].name);
    return [
      { bg:'C27', text:[
        'The frost comes back in one night, the way it always has. It flows down from the north like water, racing across roofs and windows, and stops, hissing, at the edge of your warmth.',
        lost.length ? `${lost.join(' and ')} ${lost.length > 1 ? 'were' : 'was'} outside it. By morning there is no smoke from ${lost.length > 1 ? 'those chimneys' : 'that chimney'}. Some of the survivors reach your spring. Not all.` : 'Every village in the south is inside it. For the first time in three hundred years, the frost has to go around.',
      ] },
      { bg:'C28', text:[
        'And in the long dark, something big comes down from the pass.',
        'You hear it before you see it: a dragging, scraping sound, ice on stone, and under it, chewing.',
      ] },
    ];
  },
  choices:[ { t:'Fly', go:'map' } ] },

/* ── The Grinder ── */
grinderPass: { place:"Grinder's Pass", title:'The Grinder',
  pages:[
    { bg:'C28', text:[
      'He comes nose-first, the way trolls always come, stupid with hunger: a hunched mountain of grey-blue hide crusted with rime, dragging a club of solid ice.',
      'The Grinder has hunted the long nights of Emberveld for longer than anyone has been counting. Sunlight turns trolls to stone. In a land without sun, trolls have had it very good.',
    ] },
    { bg:'A8', text:[
      'He sniffs. He smiles. Warm meat.',
      '"Little fire," he says. His voice is like a rockslide that has learned three words. "Little fire. Crunchy."',
      'Dawn is nine hours away.',
    ] },
  ],
  choices:[
    { t:'"You will turn to stone at dawn."', ask:true, reply:['The Grinder considers this for a long time. You can see the thought moving through his skull like a boulder through mud.','"Dawn," he says eventually, "is far."','He is not wrong. But it is coming.'] },
    { t:'Fight him', h:'Kill him, or hold him until the sun comes up.', fight:{ enc:'grinder', win:'grinderDead', lose:'grinderLost' } },
  ] },
grinderAttack: { bg:'C28', place:'The Spring', title:'Knock, Knock',
  text:[
    'You did not go to the Grinder. So the Grinder comes to you, on the last night of winter, following the warmth down the mountain like a dog following a cook.',
    '"Little fire," he says, at the mouth of your cave. "Found you."',
    'Dawn is nine hours away.',
  ],
  choices:[ { t:'Fight him', fight:{ enc:'grinder', win:'grinderDead', lose:'grinderLost' } } ] },
grinderDead: { place:"Grinder's Pass", title:'The Pass Is Open',
  pages: (s) => s.flags.dawned ? [
    { bg:'C29', text:[
      'The sun comes over the mountains. The Grinder sees it, too late, and raises one huge hand to cover his eyes.',
      'He stays like that. He will stay like that for a thousand years: a troll of grey stone at the top of the pass, shielding his face from the morning.',
      'The goblins come up the next day with chisels and a ladder. By spring he has a hat.',
    ] },
  ] : [
    { bg:'A8', text:[ 'The Grinder goes down like a landslide and does not get up.' ] },
    { bg:'C30', text:[ 'In his cave at the top of the pass you find what trolls always hoard: bones, mostly, and under the bones, a century of travellers\' purses.' ] },
  ],
  choices:[ { t:'Go home', fx:(s) => s.flags.dawned ? { hope:8, done:'grinder', ach:'sunrise' } : { gold:60, dread:4, done:'grinder', ach:'slayer' }, go:'ending' } ] },
grinderLost: { bg:'A8', place:"Grinder's Pass", title:'Long Night',
  text: (s) => [
    'The club comes down and the world goes white. When you wake, the Grinder is gone, and so is half a winter of food from the nearest village.',
    s.places.kettle === 'saved' ? 'Kettle will survive. Barely. Edda sends word that she is very disappointed in you, and also a basket of bread.' : 'Nobody is left to tell you what he took.',
  ],
  choices:[ { t:'Limp home', fx:{ hope:-8, done:'grinder' }, go:'ending' } ] },

/* ── Ending of chapter one ── */
ending: { place:'The Grey Hold', title:'The Answer',
  pages: (s) => [
    { bg:'A7', text:[
      'On the first morning of spring, the bell of the Grey Hold rings once, and stops.',
      'The silence after it is worse.',
    ] },
    { bg:'C31', who:'V5', text:[
      'Then something flies over the mountains from the north. It is long and pale and steel-blue, and it trails chains from its collar like broken wings. Its breath, when it roars, is blue. The snow it passes over does not melt. It freezes harder.',
      s.flags.knowsVexar ? 'You know what it is. You have heard the story enough times now. The Quench did keep an egg.' : 'You do not know what it is. You know it is a dragon. You know it is looking for you.',
      'It circles your mountain once. Then it lands on the pass, folds its wings, and waits.',
    ] },
  ],
  choices:[ { t:'End of chapter one', go:'end' } ] },

defeat: { bg:'A3', place:'The Spring', title:'Back to the Spring',
  text:['You make it home on one wing and a great deal of stubbornness, and sleep on your hoard until the bleeding stops.','The hoard is a little smaller when you wake. Some of it went into the snow on the way back.'],
  choices:[ { t:'Rest', fx:(s) => ({ hp: Math.round(s.maxHp * .4) - s.hp, gold: -Math.round(s.gold * .15) }) } ] },
};
