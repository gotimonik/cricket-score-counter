export interface GlossaryTerm {
  term: string;
  definition: string;
  link?: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "All out",
    definition:
      "A team is all out when ten of its batters have been dismissed, or cannot continue, leaving the last batter without a partner, which ends the innings. Scorers record the total as, for example, '142 all out'. In net run rate calculations a side that is bowled out is treated as having faced its full quota of overs, not the overs it actually batted.",
  },
  {
    term: "Appeal",
    definition:
      "The fielding side's request to the umpire for a decision, traditionally 'How's that?'. Under Law 31 an umpire cannot give a batter out unless the fielders appeal, even when the dismissal is obvious, although a batter may walk. The appeal must be made before the bowler starts the run-up for the next ball, and a single 'How's that?' covers every possible way of being out.",
    link: "/learn/umpire-signals-explained",
  },
  {
    term: "Backing up",
    definition:
      "When the non-striker walks a few paces down the pitch as the bowler delivers, to get a head start on a quick single. Under Law 38.3 the bowler may run out a non-striker who leaves the crease before the moment the ball would normally be released. Fielders also 'back up' throws by standing behind the stumps to stop overthrows.",
  },
  {
    term: "Bails",
    definition:
      "The two small pieces of wood that rest in grooves on top of the three stumps at each end. For the wicket to be 'put down', at least one bail must be completely removed from the top of the stumps, or a stump struck out of the ground. In very windy conditions the umpires may agree to play without bails (Law 8.5) and then judge for themselves whether the wicket was broken.",
  },
  {
    term: "Batter",
    definition:
      "The player who bats. In 2021 the MCC replaced 'batsman' with the gender-neutral 'batter' throughout the Laws, and the word is now standard in scorecards and commentary. Two batters are on the field at once: the striker, facing the bowler, and the non-striker at the bowler's end. A scorecard gives each batter a line showing runs, balls faced, fours, sixes and how they were out.",
  },
  {
    term: "Batting average",
    definition:
      "Runs scored divided by the number of times a batter has been dismissed. Not-out innings add runs but do not add a dismissal, so a batter with 300 runs from 10 innings, two of them not out, averages 300 divided by 8, or 37.50. It measures consistency over a season or career, while strike rate measures speed of scoring.",
    link: "/learn/how-to-read-a-cricket-scorecard",
  },
  {
    term: "Beamer",
    definition:
      "A full toss that passes, or would have passed, above the waist of a batter standing upright at the popping crease. Under Law 41.7 any such full toss is a no-ball. If the umpire also judges it dangerous, the bowler receives a first and final warning, and a second one sees them removed from the attack for the rest of the innings. A deliberate beamer brings immediate suspension.",
  },
  {
    term: "Bouncer",
    definition:
      "A short-pitched delivery that rises towards the batter's chest or head. Bouncers are legal, but Law 41.6 lets umpires act when short-pitched bowling becomes dangerous. Competition playing conditions usually set a limit, commonly two per over above shoulder height in Tests and ODIs and one per over in T20s. A ball that bounces clearly over head height is called a wide or a no-ball, depending on the playing conditions.",
  },
  {
    term: "Boundary",
    definition:
      "The edge of the playing area, marked by a rope, line or fence. A hit that reaches it after touching the ground scores four; one that clears it on the full scores six. If the batters had already run more than the boundary allowance, they keep the higher figure. Boundaries from byes, leg byes, wides or no-balls are recorded as extras of that type, so a wide that runs away for four is five wides.",
    link: "/learn/umpire-signals-explained",
  },
  {
    term: "Bowled",
    definition:
      "A dismissal (Law 32) in which the bowler's delivery breaks the striker's wicket, either directly or after touching the bat or the batter's body. Bowled takes priority over every other mode of dismissal, and it cannot happen from a no-ball. The wicket is credited to the bowler, and scorers write 'b' followed by the bowler's name, for example 'b Sharma'.",
    link: "/learn/how-wickets-are-credited",
  },
  {
    term: "Bowling average",
    definition:
      "Runs conceded divided by wickets taken, so a bowler who has given away 360 runs for 20 wickets averages 18.00; lower is better. Only wickets credited to the bowler count (bowled, caught, LBW, stumped and hit wicket). The runs include wides and no-balls but not byes or leg byes. It is best read alongside economy rate and bowling strike rate.",
  },
  {
    term: "Bowling crease",
    definition:
      "The line drawn through the base of the stumps at each end, 8 ft 8 in (2.64 m) long with the stumps at its centre (Law 7). The popping crease runs parallel to it, 4 ft (1.22 m) further up the pitch, and the return creases join the two at right angles. Bowlers rarely worry about this line, because the front-foot no-ball is judged against the popping crease.",
  },
  {
    term: "Bowling strike rate",
    definition:
      "The average number of legal deliveries a bowler needs to take a wicket: balls bowled divided by wickets taken. Twenty wickets from 400 balls gives a strike rate of 20.0, meaning a wicket every 20 balls, and lower is better. It is a different measure from a batter's strike rate, which counts runs per 100 balls faced.",
  },
  {
    term: "Box cricket",
    definition:
      "A fast, short format played inside an enclosed, netted court, often on artificial turf, and hugely popular in Indian cities for after-work and weekend games. Teams usually have six to eight players and play a few overs each. Its rules are local variations, not Laws, for example how many runs count when the ball hits the side or roof netting and whether a catch off the net is out.",
    link: "/learn/box-cricket-rules",
  },
  {
    term: "Bye",
    definition:
      "Runs taken when the ball passes the striker without touching the bat or the batter's body, usually because the wicketkeeper fails to stop it (Law 23). Byes are added to the team total as extras but are not credited to the batter or charged to the bowler. Byes off a no-ball are still recorded as byes, plus the no-ball penalty; runs off a wide count as wides instead.",
    link: "/learn/byes-and-leg-byes-explained",
  },
  {
    term: "Carrom ball",
    definition:
      "A spinner's delivery flicked out of the hand by squeezing the ball between the thumb and a bent middle finger, like flicking a carrom striker. From a right-arm off-spinner's action it usually turns away from a right-handed batter, which makes it hard to read. Ajantha Mendis and Ravichandran Ashwin made it famous. Like any delivery, it is legal only if the bowling arm is not straightened during delivery.",
  },
  {
    term: "Caught",
    definition:
      "A dismissal (Law 33) in which a fielder catches the ball after it has touched the bat, or a glove holding the bat, and before it hits the ground. The fielder must have control of the ball and their own movement, and must not be touching the ground beyond the boundary. It cannot occur from a no-ball. Scorers write 'c Fielder b Bowler', or 'c & b' when the bowler takes the catch.",
    link: "/learn/how-wickets-are-credited",
  },
  {
    term: "Century",
    definition:
      "An individual score of 100 runs or more in one innings, also called a hundred or a ton; 200 is a double century. Milestones are counted per innings, so scores of 60 and 40 in two innings of the same match are two separate innings, not a century. Scorecards often note how many balls the batter took to reach it, which helps compare innings.",
  },
  {
    term: "Cherry",
    definition:
      "Slang for the cricket ball, especially a new red ball with its shine and prominent seam. Taking 'the new cherry' means opening the bowling with a fresh ball. Under the Laws, in matches of three days or more the fielding captain may take a new ball once 80 overs have been bowled with the old one, unless the competition's playing conditions say otherwise.",
  },
  {
    term: "Chin music",
    definition:
      "Slang for a spell of short-pitched bowling aimed around the batter's head and shoulders, meant to unsettle and intimidate. The phrase is common in commentary when fast bowlers target a batter who looks uncomfortable against the short ball. Umpires can step in under Law 41.6 if it becomes dangerous, and helmets are strongly recommended at every level, including tennis-ball tournaments with quick bowlers.",
  },
  {
    term: "Cover",
    definition:
      "An off-side fielding position roughly halfway between point and mid-off, in front of square and about 25 to 30 metres from the bat, saving runs from drives and pushes. Deep cover is the same angle on the boundary. Because so many shots go through this area, cover is often given to one of the team's quickest and safest fielders.",
    link: "/learn/fielding-positions-explained",
  },
  {
    term: "Cover drive",
    definition:
      "A stroke played with a full, vertical bat that sends the ball through the covers on the off side, usually off the front foot to a full ball outside off stump. Good technique means the head over the ball and the front shoulder leading. Played loosely away from the body, it is one of the most common ways to edge a catch to the wicketkeeper or slips.",
    link: "/learn/batting-tips-for-beginners",
  },
  {
    term: "Cow corner",
    definition:
      "An informal name for the area on the leg side between deep midwicket and long on, where cross-batted slogs tend to land. The name jokes that in classical cricket so few shots went there that only cows would be grazing. In T20 and local cricket, where batters swing hard across the line, captains often station a boundary fielder there.",
  },
  {
    term: "Crease",
    definition:
      "The white lines marking each end of the pitch: the popping crease, the bowling crease and the return creases (Law 7). In everyday use 'the crease' usually means the popping crease, which a batter must be behind to be safe from a run out or stumping. Some part of the batter's body or bat in hand must be grounded behind the line; on the line is out.",
  },
  {
    term: "Cut",
    definition:
      "A back-foot stroke played to a short, wide ball outside off stump, hitting it with a horizontal bat towards point or gully. The square cut goes square of the wicket; the late cut is played later, guiding the ball fine past the slips. The cut needs width, and trying it to a ball too close to the body often produces an edge behind.",
  },
  {
    term: "Dead ball",
    definition:
      "A period when no runs or dismissals can happen (Law 20). The ball becomes dead when it settles in the hands of the keeper or bowler, reaches the boundary, or a batter is out, or when an umpire calls dead ball, for example if the striker is distracted. Nothing after that point is scored. A delivery called dead before the striker could play it does not count in the over.",
    link: "/learn/dead-ball-and-short-runs",
  },
  {
    term: "Death overs",
    definition:
      "The final overs of a limited-overs innings, usually the last four or five of a T20 and the last ten of an ODI, when batters attack and run rates climb sharply. Bowlers rely on yorkers, wide yorkers and slower balls to limit boundaries. Analysts often split an innings into powerplay, middle and death phases to compare how teams scored and bowled.",
    link: "/learn/death-overs-bowling-tips",
  },
  {
    term: "Declaration",
    definition:
      "When the batting captain ends their side's innings early with wickets in hand, usually in multi-innings matches to leave enough time to bowl the opposition out (Law 15). It can be made at any time the ball is dead. Scorecards show it as 'dec', for example 412-6 dec. Most limited-overs competitions do not allow declarations, though some timed club formats do.",
  },
  {
    term: "Deep midwicket",
    definition:
      "A leg-side boundary position straight out from midwicket, between deep square leg and long on. It stops and catches pulls, slog sweeps and leg-side heaves, which makes it one of the busiest positions in T20 and local cricket. Many big hitters collect a large share of their sixes in this region, so captains rarely leave it empty at the end of an innings.",
  },
  {
    term: "Dolly",
    definition:
      "Slang for a very easy catch, typically a gentle lob that hangs in the air and comes straight to a fielder. Dropping a dolly is one of the most costly and frustrating moments in a game. When it is held, the scorebook shows 'c Fielder b Bowler' and the wicket is credited to the bowler like any other catch.",
  },
  {
    term: "Doosra",
    definition:
      "Hindi and Urdu for 'the second one': a delivery from an off-spinner that turns the opposite way to the stock off-break, moving away from a right-handed batter. Pakistan's Saqlain Mushtaq is credited with developing it. It is difficult to bowl without straightening the elbow, so bowlers who use it are often scrutinised for the legality of their action.",
  },
  {
    term: "Dot ball",
    definition:
      "A legal delivery from which the batting side scores no runs, marked with a dot in the scorebook. Dot balls build pressure, and in T20 bowlers and captains track the dot-ball percentage closely. A ball on which a wicket falls without any runs is also a dot. Wides and no-balls can never be dot balls, because each adds at least one run to the total.",
  },
  {
    term: "DRS (Decision Review System)",
    definition:
      "A competition playing condition, not a Law, that lets players challenge an on-field decision. The fielding captain or the batter signals a 'T', and the third umpire checks replays, ball-tracking and edge-detection technology. Each team has a limited number of unsuccessful reviews per innings. DRS is used in professional cricket only; club and local matches rely entirely on the on-field umpires.",
  },
  {
    term: "Duck",
    definition:
      "A score of zero by a batter who is dismissed; a batter who finishes not out on zero has not made a duck. The name comes from the resemblance of the zero to a duck's egg. Related terms include the golden duck (out first ball) and the pair (out for nought in both innings of a two-innings match). Scorers simply record the score as 0.",
  },
  {
    term: "Duckworth–Lewis–Stern (DLS) method",
    definition:
      "The method used to set revised targets when rain or other interruptions shorten a limited-overs match. It treats overs remaining and wickets in hand together as 'resources' and adjusts the target by the resources each side had. Devised by Frank Duckworth and Tony Lewis and later updated by Steven Stern, it is an ICC playing condition, not a Law. Many local games use simpler run-rate methods.",
    link: "/learn/duckworth-lewis-stern-explained",
  },
  {
    term: "Economy rate",
    definition:
      "Runs conceded by a bowler per over: runs conceded divided by overs bowled. Conceding 32 runs in 4 overs gives an economy rate of 8.00. Wides and no-balls count against the bowler, but byes and leg byes do not. Convert part-overs first: 3.4 overs means three overs and four balls, which is 3.67 overs, not 3.4.",
    link: "/cricket-calculators/bowling-economy-calculator",
  },
  {
    term: "Edge",
    definition:
      "When the ball glances off the side of the bat instead of the middle, also called a nick or snick. An outside edge often carries to the wicketkeeper or slips, while an inside edge may deflect onto the pad or the stumps. Runs from an edge count as runs off the bat and are credited to the batter, and a catch from an edge is a fair dismissal.",
  },
  {
    term: "Extra cover",
    definition:
      "An off-side fielding position between cover and mid-off, slightly straighter and usually a little deeper than cover. It guards the gap through which well-timed drives travel. Captains often post a fielder there when the bowler is pitching the ball up outside off stump and inviting the batter to drive.",
  },
  {
    term: "Extras",
    definition:
      "Runs added to the team total that are not scored off the bat: wides, no-balls, byes, leg byes and penalty runs. Scorecards list them separately, for example 'Extras (b 4, lb 2, w 6, nb 3) 15'. Wides and no-balls count against the bowler's figures; byes, leg byes and penalty runs do not. In local matches extras often decide the result, so recording them accurately matters.",
    link: "/learn/how-to-read-a-cricket-scorecard",
  },
  {
    term: "Fall of wickets",
    definition:
      "The team score at the moment each wicket fell, shown on a scorecard as, for example, 'FoW: 1-23 (Khan, 4.2 ov), 2-31 (Patel, 6.1 ov)'. It reveals partnerships and collapses at a glance. Scorers record the total, the wicket number, the batter out, and the over and ball when it happened. The partnership for each wicket is usually the gap between successive scores.",
    link: "/learn/how-to-read-a-cricket-scorecard",
  },
  {
    term: "Fifty",
    definition:
      "An individual score of 50 or more in one innings, also called a half-century. In career records a score from 50 to 99 counts as a fifty, while 100 or more counts as a century instead, not as both. Scorecards often note the number of balls taken to reach it, which shows whether it was a quick or a patient innings.",
  },
  {
    term: "Fine leg",
    definition:
      "A leg-side fielding position behind square and close to the line of the pitch, behind the wicketkeeper on the leg side. Deep fine leg, or long leg, is the boundary version. It stops glances and flicks and catches top-edged hooks and pulls. In local cricket it is a common spot for the fielder who has just finished bowling an over.",
    link: "/learn/fielding-positions-explained",
  },
  {
    term: "Five-wicket haul",
    definition:
      "Five or more wickets taken by one bowler in a single innings, also called a five-for or 'fifer' and shown in figures such as 5-28. Only wickets credited to the bowler count, so run outs do not. It is the main bowling milestone on honours boards and in season records, alongside ten wickets in a match in two-innings cricket.",
  },
  {
    term: "Follow-on",
    definition:
      "In a two-innings match, the side that batted first can make the opposition bat again straight away if it leads by enough after the first innings (Law 14). The minimum lead is 200 runs in a match of five days or more, 150 in a three- or four-day match, 100 in a two-day match and 75 in a one-day match. The captain decides whether to enforce it.",
  },
  {
    term: "Follow-through",
    definition:
      "The bowler's movement after releasing the ball, as momentum carries them down the pitch. Bowlers must steer away from the protected area in the middle of the pitch (Law 41.14); after a warning, repeat offences cost five penalty runs and can see the bowler removed from the attack. A balanced, flowing follow-through also reduces strain on the back and knees.",
    link: "/learn/bowling-tips-for-beginners",
  },
  {
    term: "Forward defence",
    definition:
      "A blocking stroke played on the front foot to a good-length ball on the stumps: a stride towards the pitch of the ball, the bat angled down beside the front pad and the head over the ball. The aim is to stop the ball safely, not to score. It is usually the first shot coaches teach and is vital on uneven local pitches.",
    link: "/learn/batting-tips-for-beginners",
  },
  {
    term: "Free hit",
    definition:
      "A competition playing condition, not a Law, used in limited-overs cricket. The delivery after a no-ball is a free hit, on which the striker can only be out in the ways possible from a no-ball, such as run out. Fielders may not change positions unless the batters have swapped ends. If the free hit is itself a wide or no-ball, the next delivery is also a free hit.",
    link: "/learn/no-ball-and-free-hit-scoring",
  },
  {
    term: "French cut (Chinese cut)",
    definition:
      "An unintended inside edge that squirts past the leg stump towards fine leg when the batter was trying to drive or cut through the off side. It also goes by Chinese cut, Harrow drive and Surrey cut, with French cut now the more common name in commentary. The runs count as normal runs off the bat, but the batter has had a lucky escape.",
  },
  {
    term: "Front-foot no-ball",
    definition:
      "The most common no-ball, called when no part of the bowler's front foot, whether grounded or raised, is behind the popping crease in the delivery stride (Law 21.5). A foot landing on the line with no part behind it is a no-ball. The back foot must also land within the return crease without touching it. Bowlers fix the problem by measuring and marking their run-up.",
    link: "/learn/no-ball-and-free-hit-scoring",
  },
  {
    term: "Full toss",
    definition:
      "A delivery that reaches the batter without bouncing. Because it offers no movement off the pitch, it is usually easy to score from. A full toss passing above the batter's waist height is a no-ball under Law 41.7 and is commonly called a beamer. A low full toss at the batter's toes is close to a yorker and much harder to hit.",
  },
  {
    term: "Golden duck",
    definition:
      "Being dismissed by the first ball faced in an innings, without scoring. Being out without facing a ball at all, for example run out as the non-striker, is often called a diamond duck, and a golden duck in both innings of a match is a king pair. These are informal statistical terms; the scorebook simply shows a score of 0.",
  },
  {
    term: "Good length",
    definition:
      "A length at which the ball pitches far enough up to leave the batter unsure whether to play forward or back. For pace bowlers on most pitches that is roughly 6 to 8 metres in front of the batter's stumps; slower bowlers pitch a little fuller. Landing the ball on a good length again and again is the core skill coaches stress for beginners.",
    link: "/learn/bowling-tips-for-beginners",
  },
  {
    term: "Googly",
    definition:
      "A leg-spinner's delivery that turns the opposite way to the stock leg-break, coming into a right-handed batter from the off side. It is bowled out of the back of the hand with a leg-spin action, so it is hard to pick. Bernard Bosanquet developed it around 1900, and it is also called the wrong'un, or in older Australian slang the 'bosie'.",
  },
  {
    term: "Guard",
    definition:
      "The position a batter takes at the crease, usually asking the umpire to help line up the bat with a chosen stump, such as 'middle', 'leg' or 'two' (middle and leg). The batter then scratches a mark on the pitch to repeat the stance each ball. Guard helps the batter judge which deliveries to leave, and umpires consider the normal guard position when judging wides.",
  },
  {
    term: "Gully",
    definition:
      "An off-side catching position between the slips and point, close to the bat and slightly behind square. It catches thick outside edges and mistimed cuts that fly wider than the slips. In India 'gully' is also the everyday word for a lane or narrow street, which is where the name gully cricket comes from.",
  },
  {
    term: "Gully cricket",
    definition:
      "Informal street and lane cricket played across India and South Asia, usually with a tennis ball, improvised stumps and rules agreed on the spot. Common local variations include one tip one hand, out for hitting the ball into a house, no runs on one side and last man batting. These are house rules rather than Laws, so agree them before the first ball.",
    link: "/learn/gully-cricket-rules",
  },
  {
    term: "Handled the ball",
    definition:
      "A former mode of dismissal, removed from the Laws in the 2017 Code. A batter who wilfully touches the ball with a hand not holding the bat, other than to avoid injury or with the fielders' consent, is now out obstructing the field (Law 37). Older scorecards still show 'handled the ball', but scorers should record such dismissals as obstructing the field today.",
  },
  {
    term: "Hat-trick",
    definition:
      "Three wickets taken by the same bowler with three consecutive deliveries. All three must be credited to the bowler, so a run out does not count towards it. The balls may be spread across two overs, or even across two innings of the same match, as long as they are the bowler's consecutive deliveries. Scorers often mark the three balls in the scorebook so the feat is easy to verify later.",
  },
  {
    term: "Hit the ball twice",
    definition:
      "A dismissal (Law 34) in which the striker, after the ball has touched the bat or body, wilfully strikes it again with the bat or any part of the body except a hand not holding the bat, for a purpose other than guarding the wicket. Batters may knock the ball away from the stumps, but not to score runs or to stop a catch. It is not credited to the bowler.",
  },
  {
    term: "Hit wicket",
    definition:
      "A dismissal (Law 35) in which the striker breaks their own wicket with the bat or body while receiving a delivery, or while setting off for the first run immediately after playing at it. Common examples are the back foot clipping the stumps or the bat slipping out of the hands onto the wicket. It can happen off a wide but not a no-ball, and is credited to the bowler.",
    link: "/learn/how-wickets-are-credited",
  },
  {
    term: "Hook",
    definition:
      "An attacking cross-bat stroke to a short ball rising around head height, swivelling on the back foot to hit it round to the leg side, usually behind square. It is similar to the pull, which is played to a ball around waist or chest height. The hook carries real risk, since top edges are regularly caught at fine leg or deep square leg.",
  },
  {
    term: "Innings",
    definition:
      "One team's turn to bat, or one batter's stay at the crease. A team's innings ends when it is all out, its overs are used up, it reaches its target, or its captain declares. In cricket 'innings' is both singular and plural. Limited-overs matches give each side one innings, while Test and first-class matches allow two each.",
  },
  {
    term: "Inswinger",
    definition:
      "A delivery that swings in the air from off to leg, curving into a right-handed batter. It is bowled with the seam angled towards fine leg and the shiny side facing the off side. Inswingers bring bowled and LBW into play, as well as catches at short leg or leg slip. A ball that moves in off the pitch rather than through the air is an off-cutter.",
  },
  {
    term: "Jaffa",
    definition:
      "Slang for an exceptional, almost unplayable delivery, such as one that swings late, pitches on middle stump and hits off, or rears from a length to take the edge. Getting out to a jaffa is no disgrace for a batter. The word is common in British and Australian commentary and in club cricket around the world.",
  },
  {
    term: "Knuckle ball",
    definition:
      "A slower ball bowled with the knuckles or fingertips folded on top of the ball rather than the fingers along the seam. This kills pace and backspin, so the ball floats and dips while the arm speed looks normal. It became a popular T20 variation for fast bowlers in the 2010s, especially in the death overs.",
  },
  {
    term: "Last man batting",
    definition:
      "A local rule, common in gully, box and tennis-ball cricket, that lets the final remaining batter carry on alone after the second-last wicket falls, instead of ending the innings. Groups usually require that batter to run to the far end for each run, and some allow only singles. It is not part of the Laws, under which an innings ends when no partner remains.",
    link: "/learn/gully-cricket-rules",
  },
  {
    term: "LBW (leg before wicket)",
    definition:
      "A dismissal under Law 36. The striker is out if the ball, without first touching the bat, hits any part of the body and would have gone on to hit the stumps. The ball must not pitch outside leg stump, and if the batter tried to play a shot, the point of impact must be in line with the stumps. It cannot happen from a no-ball and is credited to the bowler.",
    link: "/learn/lbw-rule-explained",
  },
  {
    term: "Leg bye",
    definition:
      "Runs taken after the ball deflects off the batter's body, but not the bat or a glove holding it (Law 23). Leg byes are allowed only if the batter tried to play the ball with the bat or tried to avoid being hit; otherwise the runs are disallowed. They count as extras, and are neither credited to the batter nor charged to the bowler.",
    link: "/learn/byes-and-leg-byes-explained",
  },
  {
    term: "Leg slip",
    definition:
      "A close catching position on the leg side, roughly a mirror image of first slip, behind the batter's legs. It catches glances and inside edges off the pad, mostly against spin or inswing. Law 28.4 allows no more than two fielders, excluding the wicketkeeper, behind the popping crease on the leg side at the moment of delivery, which limits leg-side catchers.",
  },
  {
    term: "Leg-spin",
    definition:
      "Wrist spin bowled by a right-arm bowler that turns from leg to off for a right-handed batter, away from the bat. The ball is spun mainly by the wrist and the third finger. Leg-spinners mix in googlies, flippers and top-spinners. Shane Warne, Anil Kumble and Rashid Khan are among its best-known exponents. A left-arm bowler with the same action is a left-arm wrist spinner.",
  },
  {
    term: "Legal delivery",
    definition:
      "A ball that counts as one of the six in an over: any delivery that is not a wide or a no-ball and was not called dead before the striker could play it. Byes, leg byes and most dismissals happen on legal deliveries. Scorers and apps count legal balls to show overs in the 3.4 format, meaning three overs and four legal balls.",
  },
  {
    term: "Length",
    definition:
      "Where a delivery pitches relative to the batter. Bowlers describe it as yorker, full, good length, short of a length or short. Length decides whether the batter goes forward or back, so changing it is a bowler's main tool for creating doubt. Many coaches mark rough length zones on practice pitches with cones or chalk.",
  },
  {
    term: "Line",
    definition:
      "The direction of a delivery relative to the stumps, for example outside off stump, at the stumps or down the leg side. A tight line on or just outside off stump makes the batter play and limits safe scoring areas. Straying down the leg side gives away easy runs and wides, especially under strict limited-overs playing conditions.",
  },
  {
    term: "Long off",
    definition:
      "A boundary fielder on the off side, straight down the ground and slightly wide of the bowler's end, saving lofted and straight drives. Its leg-side mirror is long on. In T20 and local cricket both are often used together to protect the straight boundaries, particularly against batters who like to hit over the bowler's head.",
  },
  {
    term: "Long on",
    definition:
      "A boundary fielder on the leg side, straight down the ground and slightly wide of the bowler's end, saving lofted drives and slogs. With long off it guards the straight boundaries. Against spinners, a fielder at long on helps cover batters who step down the pitch to hit with the spin.",
  },
  {
    term: "Maiden over",
    definition:
      "An over in which the bowler concedes no runs that count against them. Byes and leg byes do not spoil a maiden, because they are not charged to the bowler, but a wide or a no-ball does. A maiden in which the bowler also takes a wicket is a wicket maiden. Bowling figures show maidens second, as in 4-1-22-2 (overs, maidens, runs, wickets).",
    link: "/learn/how-to-read-a-cricket-scorecard",
  },
  {
    term: "Mankad",
    definition:
      "An informal name for running out the non-striker when they leave the crease before the bowler would normally be expected to release the ball. It refers to India's Vinoo Mankad, who did it in 1947. In 2022 the MCC moved it from the unfair play Law into the run out Law (Law 38.3), confirming it as a legitimate dismissal. Scorers record it as run out, not credited to the bowler.",
    link: "/learn/how-to-record-a-run-out",
  },
  {
    term: "Mid-off",
    definition:
      "An off-side fielding position in front of square and fairly close to the bowler, about 20 to 30 metres from the batter. It stops straight and off drives and takes catches from mistimed shots. Captains and senior bowlers often field at mid-off so they can talk to the bowler between deliveries.",
  },
  {
    term: "Mid-on",
    definition:
      "The leg-side mirror of mid-off, in front of the batter and fairly close to the bowler on the on side. It saves singles from on drives and pushes and takes catches from leading edges. Moving mid-on back to the boundary invites a single but protects against the lofted drive, a common choice late in an innings.",
  },
  {
    term: "Middle",
    definition:
      "The part of the bat's face, a little below the centre, where the ball travels furthest for the least effort, also called the sweet spot. 'Middling it' means timing the ball well. 'Middle' is also a guard: a batter asking for middle lines the bat up with the middle stump.",
  },
  {
    term: "Midwicket",
    definition:
      "A leg-side fielding position between mid-on and square leg, in front of square and about 25 to 30 metres from the bat. It stops flicks, clips off the pads and pulls along the ground. Deep midwicket is the boundary equivalent. Many right-handers score heavily through this area, so captains often place a strong fielder here.",
  },
  {
    term: "Net run rate",
    definition:
      "A tournament tie-breaker: a team's runs scored per over across all its matches minus the runs per over scored against it. A team that scores 160 from 20 overs and concedes 150 from 20 overs has a net run rate of +0.500. A side bowled out counts as having faced its full quota of overs, and overs such as 19.3 must be converted to 19.5 first.",
    link: "/learn/net-run-rate-explained",
  },
  {
    term: "Nightwatcher",
    definition:
      "A lower-order batter sent in ahead of a specialist near the close of a day's play in multi-day cricket, to shield the better batter from losing their wicket in fading light or a tricky last few overs. Traditionally called a nightwatchman, the gender-neutral nightwatcher follows the Laws' wording. The tactic has little use in limited-overs and local one-day cricket.",
  },
  {
    term: "No-ball",
    definition:
      "An illegal delivery (Law 21) that adds one run to the batting side and does not count in the over. Common causes are overstepping the popping crease, a full toss above waist height, throwing, and too many fielders behind square on the leg side. The striker cannot be bowled, caught, LBW, stumped or out hit wicket. Runs off the bat go to the batter; the penalty is charged to the bowler.",
    link: "/learn/no-ball-and-free-hit-scoring",
  },
  {
    term: "Non-striker",
    definition:
      "The batter standing at the bowler's end, not facing the current delivery. The non-striker should stay in their ground until the bowler would normally release the ball, or risk being run out (Law 38.3). After an odd number of runs the batters have changed ends, so the non-striker faces the next ball; the strike also changes at the end of each over.",
    link: "/learn/strike-rotation-explained",
  },
  {
    term: "Not out",
    definition:
      "A batter still batting when the innings ends, or who retired hurt and did not return, is shown as not out, often with an asterisk, as in 47*. Not-out innings add runs to a batter's record but not a dismissal, which is why they raise a batting average. 'Not out' is also the umpire's answer when turning down an appeal.",
  },
  {
    term: "Nurdle",
    definition:
      "Slang for nudging the ball into gaps for ones and twos with soft hands and angled bats, rather than hitting boundaries. Good nurdlers keep the scoreboard moving and rotate the strike so the bowler cannot settle. On slow pitches and big grounds in club cricket, the ability to nurdle is often worth more than raw power.",
  },
  {
    term: "Obstructing the field",
    definition:
      "A dismissal (Law 37) in which either batter wilfully obstructs or distracts the fielding side by word or action, for example deliberately changing direction while running to block a throw. Since the 2017 Code it also covers wilfully striking the ball with a hand not holding the bat, which replaced the old handled the ball dismissal. It is not credited to the bowler.",
    link: "/learn/how-wickets-are-credited",
  },
  {
    term: "ODI (One Day International)",
    definition:
      "A limited-overs match between international teams in which each side bats for up to 50 overs and each bowler may bowl at most 10. The first was played in 1971 between Australia and England. Fielding restrictions apply in three powerplay phases, and matches shortened by rain use the DLS method to set revised targets.",
  },
  {
    term: "Off side and leg side",
    definition:
      "The two halves of the field, divided by an imaginary line running down the pitch through the middle stumps. The off side is the side the batter faces in their stance, to a right-hander's right as they look at the bowler; the leg side, or on side, is behind their legs. The sides swap for a left-handed batter, so fields must be reset when strike changes.",
    link: "/learn/fielding-positions-explained",
  },
  {
    term: "Off-spin",
    definition:
      "Finger spin bowled by a right-arm bowler that turns from off to leg, into a right-handed batter, with the ball spun mainly by the index finger. Off-spinners rely on flight, drift and changes of pace, and variations include the arm ball, the doosra and the carrom ball. The left-arm equivalent, which turns the other way, is called left-arm orthodox.",
  },
  {
    term: "One tip one hand",
    definition:
      "A popular local rule in gully and tennis-ball cricket: a fielder who catches the ball one-handed after it has bounced once has taken a valid catch, and the batter is out. It suits tight spaces and soft balls. It is not part of the Laws, under which a ball that has touched the ground cannot be caught, so agree on it before the match.",
    link: "/learn/tennis-ball-cricket-rules",
  },
  {
    term: "Opener",
    definition:
      "One of the two batters who start an innings, facing the new ball when it usually swings and bounces most. Openers need a sound defence and good judgement of which balls to leave, although in T20 they are also expected to attack during the powerplay. The bowlers who bowl the first overs are called opening bowlers.",
  },
  {
    term: "Outfield",
    definition:
      "The grassed part of the playing area away from the pitch, running out to the boundary. A fast, smooth outfield turns more shots into fours, while a slow, long-grassed or bumpy one stops balls short and causes misfields. Checking the outfield before the toss helps a local team judge what a competitive total will be.",
  },
  {
    term: "Outswinger",
    definition:
      "A delivery that swings in the air from leg to off, curving away from a right-handed batter, bowled with the seam angled towards the slips. Outswingers tempt the batter to drive and produce edges to the wicketkeeper and slips, which is why captains set attacking fields with several slips for a good outswing bowler.",
  },
  {
    term: "Over",
    definition:
      "A set of six legal deliveries bowled by one bowler from one end (Law 17). Wides and no-balls do not count, so an over can contain more than six balls. Ends change after each over, and no bowler may bowl two consecutive overs. Overs are written as completed overs plus balls, so 12.4 means 12 overs and 4 balls, not a decimal.",
    link: "/cricket-calculators/overs-converter",
  },
  {
    term: "Over the wicket",
    definition:
      "Bowling with the bowling arm nearer the stumps, so a right-arm bowler passes to the left of the non-striker's wicket as they deliver. It is the usual approach for most bowlers to right-handed batters. Under Law 21.1 the bowler must tell the umpire whether they are bowling over or round the wicket, and switching without notice is a no-ball.",
  },
  {
    term: "Overthrow",
    definition:
      "Extra runs that result from a fielder's throw that misses the stumps or gets past the keeper, letting the batters run again. They are added to runs already completed. If an overthrow reaches the boundary, the score is four plus the runs completed, plus the run in progress if the batters had crossed when the throw was made (Law 19.8). They are credited to the batter if the ball came off the bat.",
    link: "/learn/overthrows-in-cricket",
  },
  {
    term: "Pair",
    definition:
      "Being dismissed for nought in both innings of the same two-innings match. If both dismissals came first ball, it is a king pair. A pair is a statistical curiosity rather than a rule, and only possible in Test, first-class or other two-innings matches; in one-innings local cricket the equivalent worry is simply a duck.",
  },
  {
    term: "Par score",
    definition:
      "The total a team batting first would expect to be competitive on a given ground, pitch and format. In rain-affected matches, par score has a specific DLS meaning: the score the chasing side needs at that point to be level, which decides the result if no more play is possible. Broadcasters often display the DLS par after each over when rain threatens.",
    link: "/cricket-calculators/rain-target-calculator",
  },
  {
    term: "Partnership",
    definition:
      "The runs scored while a particular pair of batters is together, from one wicket falling to the next, or to the end of the innings. It includes extras scored during that time. Scorecards list partnerships by wicket, for example a 64-run stand for the third wicket. Breaking a big partnership is often the turning point of a match.",
  },
  {
    term: "Penalty runs",
    definition:
      "Five-run awards made by the umpires for breaches of the Laws, such as the ball striking a fielding side's helmet left on the ground, illegal fielding, deliberate short running, damaging the pitch, time-wasting or serious misconduct. They are added to the extras, and are neither credited to a batter nor charged to a bowler. Scorers record them as 'p' or 'pen' in the extras line.",
  },
  {
    term: "Pitch",
    definition:
      "The rectangular strip in the centre of the ground on which the ball is bowled, 22 yards (20.12 m) long between the bowling creases and 10 ft (3.05 m) wide (Law 6). Its hardness, grass cover and moisture affect bounce, seam and spin. The word is also a verb for where the ball lands, as in 'it pitched outside leg stump'.",
  },
  {
    term: "Point",
    definition:
      "An off-side fielding position square of the wicket, roughly level with the batter and about 15 to 25 metres away. It stops and catches cuts and square drives. Backward point is slightly behind square, deep point is on the boundary, and silly point is a very close version used against spin.",
  },
  {
    term: "Popping crease",
    definition:
      "The line 4 ft (1.22 m) in front of, and parallel to, the bowling crease at each end (Law 7). It is the batter's line of safety: part of the body or the bat in hand must be grounded behind it to avoid a run out or stumping. It also governs the front-foot no-ball, since part of the bowler's front foot must land behind it.",
  },
  {
    term: "Powerplay",
    definition:
      "A competition playing condition, not a Law, limiting how many fielders may stand outside the 30-yard circle. In men's T20 internationals only two fielders may be outside it for the first six overs. ODIs use three phases: overs 1 to 10 (two outside), 11 to 40 (four) and 41 to 50 (five). Local leagues often adapt the idea to shorter matches.",
    link: "/learn/powerplay-strategy",
  },
  {
    term: "Pull",
    definition:
      "A cross-bat stroke played off the back foot to a short ball around waist or chest height, hitting it to the leg side in front of or square of the wicket. It is one of the most productive shots against fast bowling on bouncy pitches. When the ball is higher, around the head, the same stroke becomes a hook.",
  },
  {
    term: "Rabbit",
    definition:
      "Slang for a very weak batter, usually a specialist bowler batting at number 10 or 11. A batter who is dismissed repeatedly by one particular bowler is also called that bowler's rabbit or bunny. Captains often attack a rabbit with close fielders and a full, straight line, since one good ball is usually enough.",
  },
  {
    term: "Required run rate",
    definition:
      "The runs per over the chasing side needs to win: runs still required divided by overs remaining. Needing 54 from 6 overs means a required rate of 9.00. Convert balls properly: 54 needed from 5.3 overs means 33 balls, or 5.5 overs, so the rate is 9.82. Comparing it with the current run rate shows whether a chase is on track.",
    link: "/learn/chasing-a-target-required-run-rate",
  },
  {
    term: "Retire at 25 or 30 (local rule)",
    definition:
      "A local variation, common in gully, box and corporate tennis-ball cricket, in which a batter must leave the crease on reaching a set score such as 25 or 30, so that everyone gets a bat. Teams decide whether the retired batter may return later if wickets run out. It is not a Law, and scorers usually record it as retired not out, not a dismissal.",
    link: "/learn/gully-cricket-rules",
  },
  {
    term: "Retired hurt",
    definition:
      "A batter who leaves the field through injury, illness or another unavoidable cause, with the umpire informed, is retired hurt under Law 25.4. They may resume their innings later, at the fall of a wicket or another retirement. If they do not come back, the scorecard shows 'retired not out', which does not count as a dismissal.",
  },
  {
    term: "Retired out",
    definition:
      "When a batter retires for any reason other than injury, illness or another unavoidable cause and does not resume with the opposing captain's consent, the scorecard shows 'retired out' (Law 25.4.3). It counts as a dismissal but is not credited to the bowler. Teams occasionally use it tactically in T20 to bring in a faster scorer. With the nine dismissals in Laws 32 to 40, it makes ten ways to be out.",
  },
  {
    term: "Return crease",
    definition:
      "The lines at each end running at right angles to the popping crease, 4 ft 4 in (1.32 m) either side of the middle stump, and extending at least 8 ft (2.44 m) behind the popping crease. In the delivery stride the bowler's back foot must land inside the return crease without touching it, or the umpire calls a no-ball (Law 21.5).",
  },
  {
    term: "Reverse sweep",
    definition:
      "A sweep played the opposite way: the batter keeps the same stance but swings the bat across the body to send the ball towards point or third man, often against spinners when the off side is open. It is legal because the batter has not changed stance before the bowler runs in. Against a straight ball, a miss brings a real LBW risk.",
  },
  {
    term: "Reverse swing",
    definition:
      "Swing in the opposite direction to conventional swing for the same seam position, usually achieved with an older ball, at high pace, when one side is rough and the other kept dry and smooth. It tends to come late, making full deliveries hard to dig out. Altering the ball's condition by scratching it or using artificial substances is ball tampering under Law 41.3.",
  },
  {
    term: "Round the wicket",
    definition:
      "Bowling with the bowling arm further from the stumps, so a right-arm bowler runs in to the right of the non-striker's wicket. It creates a different angle and is often used by right-arm bowlers against left-handers, or by spinners aiming at rough outside a batter's leg stump. The umpire must be told of any change of side, or the delivery is a no-ball.",
  },
  {
    term: "Run out",
    definition:
      "A dismissal (Law 38) in which a batter is out of their ground while the ball is in play and the wicket at that end is fairly put down by the fielding side. It can happen off a wide or a no-ball. The batter out is the one whose ground is at that end. It is not credited to the bowler; completed runs count, but the run in progress does not.",
    link: "/learn/how-to-record-a-run-out",
  },
  {
    term: "Run rate",
    definition:
      "The average runs scored per over: total runs divided by overs faced. A team on 96 after 12 overs has a run rate of 8.00. Convert part-overs first: 96 after 12.3 overs is 96 divided by 12.5, or 7.68. Scoreboards show it as the current run rate (CRR), alongside the required run rate during a chase.",
    link: "/cricket-calculators/run-rate-calculator",
  },
  {
    term: "Runner",
    definition:
      "A team-mate who runs between the wickets for an injured batter. The Laws (Law 25.5) still allow a runner when the umpires accept that a batter has been injured or taken ill during the match, but international playing conditions have banned runners since 2011. If the runner is run out, the injured batter is out. Many club leagues follow the international ban, so check your rules.",
  },
  {
    term: "Scoop",
    definition:
      "A stroke in which the batter crouches and lifts a full-length ball over their own shoulder or head towards fine leg or the area behind the wicketkeeper. Tillakaratne Dilshan's version became known as the 'Dilscoop'. It exploits empty areas behind the wicket in limited-overs cricket, but a mistimed scoop can hit the face, so a helmet is essential.",
  },
  {
    term: "Seam",
    definition:
      "The raised stitching around the middle of a leather cricket ball. Bowlers try to land it upright so the ball deviates sideways off the pitch, known as seam movement, and a seam bowler is a pace bowler who relies mainly on this rather than swing. Lifting or picking the seam with fingernails or any object is ball tampering under Law 41.3.",
  },
  {
    term: "Short leg",
    definition:
      "A close catching position on the leg side, only a few metres from the bat, often called forward short leg or bat-pad. It catches balls that pop up off the inside edge and pad, mainly against spin and short-pitched bowling. Fielders there must wear a helmet and protective equipment, and should not stand there in casual local games without it.",
  },
  {
    term: "Short run",
    definition:
      "A run in which a batter turns back without grounding the bat or body behind the popping crease. The umpire signals 'one short' and that run is not scored (Law 18.4). Deliberate short running to steal runs is unfair: no runs are scored, the batters return to their original ends and five penalty runs go to the fielding side (Law 18.5).",
    link: "/learn/dead-ball-and-short-runs",
  },
  {
    term: "Sightscreen",
    definition:
      "A large screen placed beyond the boundary in line with the pitch, behind the bowler, so the batter can pick the ball up against a plain background. It is white for red-ball cricket and black for white-ball cricket. Movement in front of it can distract the batter, and the umpire may hold up play until it stops.",
  },
  {
    term: "Silly point",
    definition:
      "A very close off-side catching position, just a couple of metres from the bat and opposite short leg. It catches bat-pad deflections and soft defensive prods, mostly against spin. Fielders there should wear a helmet and protective equipment, and under the Laws they must not make significant movement before the ball reaches the striker.",
  },
  {
    term: "Sitter",
    definition:
      "Slang for an easy catch that should always be taken, such as a gentle lob or a skier the fielder has plenty of time to settle under. 'Dropping a sitter' describes a missed chance any fielder should have held. Scorers who track dropped catches log it against the fielder, which helps captains decide who fields in key positions.",
  },
  {
    term: "Sledging",
    definition:
      "Verbal needling of opponents, usually of batters by fielders, to break their concentration. Light banter is common, but abuse crosses the line: under Law 42 umpires can penalise offensive conduct with penalty runs and report players, and many local leagues add suspensions. The Spirit of Cricket expects players to respect opponents and umpires at all times.",
  },
  {
    term: "Slip",
    definition:
      "Close catching positions beside the wicketkeeper on the off side, numbered first slip, second slip and so on, moving outwards. Slips catch outside edges from deliveries angled or swinging away from the batter. A full slip cordon is an attacking field; in T20 and local cricket a single slip is more common so that runs can be saved elsewhere.",
    link: "/learn/fielding-positions-explained",
  },
  {
    term: "Slower ball",
    definition:
      "A delivery bowled noticeably slower than the bowler's normal pace with a similar arm action, to trick the batter into playing too early. Variations include the off-cutter, leg-cutter, back-of-the-hand ball and knuckle ball. It is a key weapon in the death overs, especially on slow pitches where batters rely on the bowler's pace for their power.",
  },
  {
    term: "Square leg",
    definition:
      "A leg-side fielding position square of the wicket, level with the batter and roughly 20 to 30 metres away. The umpire at the striker's end usually stands in this area, which is why they are called the square-leg umpire. Deep square leg is the boundary version, used against pulls and sweeps.",
    link: "/learn/fielding-positions-explained",
  },
  {
    term: "Strike rate",
    definition:
      "For batters, runs scored per 100 balls faced: runs divided by balls, multiplied by 100. A batter with 45 off 30 balls has a strike rate of 150. Balls faced include no-balls but not wides, since a wide is not counted as a ball faced by the striker. For bowlers, strike rate means balls bowled per wicket instead.",
    link: "/cricket-calculators/strike-rate-calculator",
  },
  {
    term: "Striker",
    definition:
      "The batter at the wicketkeeper's end who faces the delivery. Only the striker can score runs off the bat, and only the striker can be out bowled, caught, LBW, stumped or hit wicket. The strike changes when the batters complete an odd number of runs and at the end of every over, which is why scorers must track who is on strike.",
    link: "/learn/strike-rotation-explained",
  },
  {
    term: "Stumped",
    definition:
      "A dismissal (Law 39) in which the wicketkeeper puts down the wicket while the striker is out of their ground and not attempting a run, without another fielder touching the ball. It can happen off a wide but not off a no-ball. It is credited to the bowler, and scorers write 'st Keeper b Bowler'. If the striker was attempting a run, it is a run out instead.",
    link: "/learn/how-wickets-are-credited",
  },
  {
    term: "Stumps",
    definition:
      "The three upright wooden posts at each end, 28 in (71.12 cm) high, which together with the two bails form a wicket 9 in (22.86 cm) wide (Law 8). Smaller sizes are allowed in junior cricket. 'Stumps' also means the end of a day's play in a multi-day match, when the umpires remove the bails, as in 'India were 210-4 at stumps'.",
    link: "/learn/cricket-equipment-guide",
  },
  {
    term: "Super over",
    definition:
      "A tie-breaker set by competition playing conditions, not the Laws, for tied limited-overs matches. Each team faces one over with three batters, so two wickets end its innings, and the side that batted second in the match bats first. Under ICC conditions, if the super over is also tied, further super overs are played until there is a winner.",
    link: "/learn/super-over-and-tie-rules",
  },
  {
    term: "Sweep",
    definition:
      "A cross-bat stroke played on one knee, swinging the bat horizontally to hit a full ball, usually from a spinner, round to the leg side behind or square of the wicket. It is useful against spinners bowling at or outside leg stump. The slog sweep is a lofted version aimed at deep midwicket. Missing a sweep in front of the stumps brings LBW into play.",
  },
  {
    term: "Sweeper",
    definition:
      "A fielder placed on the boundary to cut off drives and cuts that beat the inner ring, usually at deep cover or deep point, sometimes on the leg side at deep midwicket. A sweeper turns potential fours into singles, which is why the position is common in limited-overs and local cricket once fielding restrictions end.",
  },
  {
    term: "Swing",
    definition:
      "Sideways movement of the ball through the air, caused by uneven airflow over its two sides. Conventional swing comes from a newish ball with one side polished, with the seam angled towards the slips for outswing or towards fine leg for inswing. Tape-wrapped tennis balls also swing a great deal, which is why tape-ball bowlers can be so hard to face.",
  },
  {
    term: "Switch hit",
    definition:
      "A stroke in which the batter changes grip and stance as the bowler runs in, turning from right-handed to left-handed or the reverse, to hit into a less protected area. Kevin Pietersen popularised it in 2008 and the MCC confirmed it as legal. For LBW, the off side is fixed by the batter's stance when the bowler begins the run-up.",
  },
  {
    term: "T20 (Twenty20)",
    definition:
      "A limited-overs format of 20 overs per side, with each bowler limited to four overs, so a match lasts about three hours. Professional T20 includes a six-over powerplay, a free hit after every no-ball and a super over to settle ties. Most club, corporate and local tournaments copy its structure, often in shorter versions of 8 to 12 overs.",
  },
  {
    term: "Tail-ender",
    definition:
      "A lower-order batter, usually batting at 8 to 11 and picked mainly as a bowler; together these batters are called the tail. Bowling sides try to 'clean up the tail' quickly, and when the tail 'wags' the lower order adds unexpected runs. A set batter batting with tail-enders often tries to take most of the strike to protect them.",
  },
  {
    term: "Tape-ball cricket",
    definition:
      "Street cricket played with a tennis ball wrapped tightly in electrical insulating tape, making it heavier, faster and far more prone to swing than a plain tennis ball, while still safer than leather. It is hugely popular in Pakistan, India and South Asian communities abroad. Matches are short and rules are local variations, and bowlers can generate real pace and late swing.",
    link: "/learn/tennis-ball-cricket-rules",
  },
  {
    term: "Target",
    definition:
      "The score the side batting second needs to win: one run more than the first side's total, so chasing 168 means a target of 169. If rain shortens the match, the target is revised using a method such as DLS or an agreed local run-rate rule, and scorers should note the revised target and overs clearly before play restarts.",
    link: "/learn/shortened-match-targets",
  },
  {
    term: "Tennis-ball cricket",
    definition:
      "Cricket played with a tennis ball instead of a hard leather ball, common in India's streets, parks and organised tournaments. It needs little protective gear, bounces more than leather and rewards big hitting. Matches are usually short, and rules such as one tip one hand or restrictions on bouncers are local variations, not Laws, so agree them first.",
    link: "/learn/tennis-ball-cricket-rules",
  },
  {
    term: "Test cricket",
    definition:
      "The longest international format: each team has two innings, and matches are scheduled for up to five days, with 90 overs a day under standard playing conditions. A Test can be won, lost, tied or drawn, a draw meaning time ran out before a result. Domestic first-class cricket uses the same two-innings structure over three or four days.",
  },
  {
    term: "The Hundred",
    definition:
      "A 100-ball format launched in England and Wales in 2021, with men's and women's competitions. Each innings lasts 100 balls; ends change after every ten balls, and a bowler delivers either five or ten consecutive balls, up to 20 in a match. It has a 25-ball powerplay. Its rules are competition playing conditions rather than Laws.",
  },
  {
    term: "Third man",
    definition:
      "An off-side fielding position behind square and finer than the slips, usually on the boundary. It collects edges and late cuts that run past the slips and gully. In limited-overs and local cricket, a fielder at third man saves many boundaries from thick outside edges, especially against quicker bowlers.",
  },
  {
    term: "Third umpire",
    definition:
      "An off-field official who uses television replays to rule on run outs, stumpings, boundaries, catches and DRS reviews, and in some competitions front-foot no-balls. Using a third umpire is a competition playing condition rather than a Law. In club and local cricket there is none, so the two on-field umpires decide everything.",
  },
  {
    term: "Timed out",
    definition:
      "A dismissal (Law 40) in which an incoming batter is not ready to face, or for their partner to face, within three minutes of the previous dismissal or retirement; ICC playing conditions shorten this to two minutes. The fielding side must appeal, and it is not credited to the bowler. Angelo Mathews became the first international batter given out this way, in 2023.",
  },
  {
    term: "Toss",
    definition:
      "The coin toss before a match that lets the winning captain choose whether to bat or bowl first (Law 13.4). Traditionally the home captain tosses and the visiting captain calls. The choice depends on the pitch, weather, dew and team strengths; chasing is often preferred in limited-overs games when dew is expected later. Scorers should record the toss winner and decision.",
    link: "/learn/toss-bat-or-bowl-first",
  },
  {
    term: "Trial ball",
    definition:
      "A local custom in gully and tennis-ball cricket in which the bowler sends down one practice delivery before the over or innings, which does not count and cannot dismiss the batter. The Laws do not allow practice deliveries on the pitch during play (Law 26), so it is purely a house rule. Scorers should leave it out of the over entirely.",
    link: "/learn/gully-cricket-rules",
  },
  {
    term: "Umpire's call",
    definition:
      "A DRS outcome used when ball-tracking shows a marginal result, such as less than half the ball hitting the stumps zone or impact only partly in line. The on-field decision stands, whether out or not out, and the reviewing team keeps its review. It exists only under DRS playing conditions, not in the Laws, so it never arises in local cricket.",
    link: "/learn/lbw-rule-explained",
  },
  {
    term: "Underarm bowling",
    definition:
      "Bowling with the arm below shoulder level, rolling or lobbing the ball. Under Law 21.1.2 it is not permitted unless agreed before the match, and it has been banned in international cricket since the 1981 Trevor Chappell incident. Some box, indoor and children's games use underarm bowling as a local rule, mainly for safety in confined spaces.",
    link: "/learn/box-cricket-rules",
  },
  {
    term: "Wicket",
    definition:
      "A word with several meanings: the set of three stumps and two bails at each end; a dismissal, as in 'she took a wicket'; the pitch itself, as in 'a flat wicket'; and the number of batters out, as in '120 for 3'. India and most countries write that score as 120/3, while Australia traditionally writes 3/120, which can confuse scorers.",
  },
  {
    term: "Wicketkeeper",
    definition:
      "The specialist fielder behind the striker's stumps, the only fielder allowed to wear gloves and external leg guards (Law 27). The keeper takes catches, makes stumpings and run outs, and stops byes. They must stay wholly behind the wicket until the ball passes the stumps, touches the bat or batter, or the striker attempts a run; otherwise the umpire calls a no-ball.",
    link: "/learn/fielding-positions-explained",
  },
  {
    term: "Wide",
    definition:
      "A delivery the umpire judges too wide or high for the striker to hit with a normal stroke, both where they stand and from a normal guard position (Law 22). It adds one run, does not count in the over, and must be re-bowled. Any runs taken are added as wides, so four byes off a wide become five wides. Limited-overs playing conditions apply stricter guidelines, especially down the leg side.",
    link: "/learn/how-to-score-wides",
  },
  {
    term: "Yorker",
    definition:
      "A full delivery that lands at or just in front of the batter's toes, around the popping crease, making it very hard to get the bat down in time. It is the classic death-overs ball, aimed at the base of the stumps or wide outside off stump as a wide yorker. Missed by a little, it becomes a full toss or half-volley, so it takes plenty of practice.",
    link: "/learn/death-overs-bowling-tips",
  },
];
