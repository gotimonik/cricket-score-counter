import { Article } from "../articleTypes";

export const lawsArticles: Article[] = [
  {
    slug: "lbw-rule-explained",
    title: "The LBW Rule Explained Simply: Pitching, Impact and Shots",
    metaDescription:
      "A plain-English guide to LBW under Law 36: where the ball pitched, where it hit the pad, whether a shot was offered, and how umpires decide without DRS.",
    keywords:
      "lbw rule, leg before wicket explained, law 36 cricket, pitching outside leg stump, lbw no shot offered, how to give lbw, lbw umpire guide",
    category: "Laws Explained",
    datePublished: "2026-09-20",
    summary:
      "LBW is the dismissal that causes the most arguments in local cricket, yet the law itself follows a simple checklist. This guide walks through each question an umpire must answer, in the order they should ask them, with examples from club and gully matches.",
    keyTakeaways: [
      "A batter can never be out LBW if the ball pitched outside leg stump, or if it hit the bat first.",
      "Impact must be in line with the stumps, unless the batter made no genuine attempt to hit the ball with the bat.",
      "The umpire must be confident the ball would have gone on to hit the stumps; any real doubt goes to the batter.",
      "LBW is only given on appeal and is credited to the bowler.",
      "You cannot be out LBW off a no-ball or a free hit.",
    ],
    sections: [
      {
        heading: "What LBW actually protects against",
        paragraphs: [
          "Leg before wicket exists for one reason: without it, a batter could simply stand in front of the stumps and kick every straight ball away. Law 36 stops that by allowing the bowler to win the wicket when the batter's body, rather than the bat, prevents the ball from hitting the stumps.",
          "The law does not say \"the ball hit the pad, so it's out\". That is the most common misunderstanding in local games. Being hit on the pad is only the starting point. The umpire then has to work through several separate conditions, and if any one of them fails, the answer is not out.",
          "It helps to think of LBW as a series of gates. The ball has to pass through every gate in turn. A good umpire asks the questions in a fixed order every time, which makes decisions faster and far easier to explain to an unhappy batter.",
        ],
      },
      {
        heading: "The checklist, in the order umpires use it",
        paragraphs: [
          "Most experienced umpires run through the same sequence in their head between the appeal and the decision. It takes a second or two once you have practised it. If you are umpiring a club or school match without much experience, saying the steps quietly to yourself is perfectly normal.",
          "Notice that the first questions are the quick, objective ones. If the delivery was a no-ball or the ball pitched outside leg, you do not even need to think about whether it was hitting the stumps.",
        ],
        steps: [
          "Was it a fair delivery? If it was a no-ball (or a free hit), it cannot be LBW.",
          "Where did it pitch? If it pitched outside the line of leg stump, not out. Pitching in line or outside off stump is fine.",
          "Did it hit the bat (or the glove holding the bat) first? If yes, not out. If bat and pad were hit at the same moment, treat it as bat first.",
          "Where was the point of impact? It must be between wicket and wicket, unless the batter made no genuine attempt to play the ball with the bat, in which case impact outside off stump is also allowed.",
          "Would the ball have gone on to hit the stumps? You must be confident, not just hopeful.",
        ],
      },
      {
        heading: "Pitching outside leg stump",
        paragraphs: [
          "This is the one condition that cannot be overcome. If the ball lands outside the line of the leg stump, the batter is not out LBW, no matter how plumb it looks afterwards. The reason is historical and practical: the law does not want batters penalised for balls angled into them from the leg side that they could not reasonably play.",
          "\"In line\" means the ball touched the ground on a strip the width of the stumps, extended all the way down the pitch. Any part of the ball touching that strip counts as in line. Pitching outside off stump is completely acceptable, which is why off-spinners and in-swing bowlers win so many LBW decisions.",
          "If the ball does not bounce at all, such as a full toss, there is no pitching question. The umpire simply imagines the flight continuing in a straight line from the point of impact, even if it would have bounced before reaching the stumps.",
        ],
      },
      {
        heading: "Impact and the \"no shot offered\" exception",
        paragraphs: [
          "Normally, the ball must hit the batter between wicket and wicket. Height does not matter on its own; a ball can hit the thigh and still be out if it would have gone on to hit the stumps. Impact outside the line of leg stump is never out.",
          "The exception is when the batter makes no genuine attempt to hit the ball with the bat. Padding up and leaving the ball deliberately is a risk. In that situation the batter can be out even if the impact is outside the line of off stump, provided every other condition is met. Holding the bat behind the pad, or raising it in the air and kicking the ball away, is not a genuine attempt.",
          "Judging a genuine attempt is about the bat, not the feet. A batter who pushes forward with the bat close to the pad and misses has offered a shot. A batter who lets the ball hit the front pad with the bat tucked well behind it has not.",
        ],
        callout: {
          title: "Match scenario: the padded-up off-spinner",
          text: "Saturday league, right-handed batter, off-spinner bowling around the wicket. The ball pitches a foot outside off stump and spins back. The batter shoulders arms, bat high, and it strikes the front pad about two inches outside off. Pitched outside off: fine. Bat not involved: fine. Impact outside off, but no shot offered: allowed. Spinning back towards middle and leg at a gentle height: hitting. The correct decision is out, LBW, credited to the bowler. Had the batter pushed at the ball with the bat and missed, the impact outside off would have made it not out.",
        },
      },
      {
        heading: "Would it have hit the stumps?",
        paragraphs: [
          "This is the hardest judgement, and it is where local umpires most often get it wrong in both directions. You have to picture the path the ball would have taken after the impact, allowing for spin or swing already visible, and ask whether it would have hit the stumps.",
          "Things that should make you cautious include a ball striking the batter well down the pitch, a sharp bounce suggesting it would have gone over the top, and a big turn suggesting it would have missed leg. The further forward the batter is, the more doubt there usually is.",
          "Benefit of the doubt belongs to the batter. In professional cricket the Decision Review System has an \"umpire's call\" margin for exactly this reason. In club and gully cricket there is no ball-tracking, so if you would describe your view as \"probably hitting\", that is not quite enough.",
        ],
        table: {
          caption: "Quick reference for common LBW situations (right-handed batter)",
          headers: ["Pitched", "Impact", "Shot offered?", "Hitting stumps?", "Decision"],
          rows: [
            ["Outside leg", "In line", "Either", "Yes", "Not out"],
            ["In line", "In line", "Yes", "Yes", "Out"],
            ["Outside off", "In line", "Yes", "Yes", "Out"],
            ["Outside off", "Outside off", "Yes", "Yes", "Not out"],
            ["Outside off", "Outside off", "No", "Yes", "Out"],
            ["In line", "Outside leg", "Either", "Yes", "Not out"],
            ["In line", "In line", "Yes", "Doubtful", "Not out"],
          ],
        },
      },
      {
        heading: "Appeals, umpire position and local cricket habits",
        paragraphs: [
          "No batter is ever out LBW unless a fielder appeals. The usual \"Howzat\" covers every type of dismissal, so the umpire may consider LBW even if the bowler thought it was a catch. Only the bowler's end umpire can give LBW; the square leg umpire has no view of the line.",
          "Position matters. Stand directly behind the stumps, close enough to see where the ball pitches, and keep your head still as the bowler delivers. If you drift to one side, every judgement about line becomes guesswork.",
          "Many tennis-ball, gully and box cricket games simply drop LBW altogether, because there is rarely a neutral umpire and the bounce is unpredictable. That is a fair house rule, but agree it before the toss. If you are scoring with Cricket Score Counter, an LBW is recorded as a wicket with that dismissal type and credited to the bowler, and the undo button is there if an umpire changes his mind after a quiet word.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can a batter be out LBW if the ball hits them outside the line of off stump?",
        answer:
          "Only if they made no genuine attempt to play the ball with the bat. If they offered a shot, impact outside off stump means not out. Impact outside leg stump is never out, shot or no shot.",
      },
      {
        question: "Is it out if the ball hits the pad and then the bat?",
        answer:
          "Yes, it can be. The law only protects the batter if the ball hits the bat first. If pad comes first and the other conditions are met, the later bat contact does not save them, and the umpire must also consider a catch if the ball carries to a fielder.",
      },
      {
        question: "Can you be LBW to a full toss above knee height?",
        answer:
          "Yes. There is no height limit in Law 36. The umpire assumes the ball continues on its path after impact, so a full toss striking the thigh in line can be out if it was heading for the stumps.",
      },
      {
        question: "Can you be out LBW off a no-ball or free hit?",
        answer:
          "No. A batter cannot be out LBW off a no-ball, and a free hit carries the same protection. The only dismissals possible off a no-ball are run out, hit the ball twice and obstructing the field.",
      },
      {
        question: "Does LBW count as a wicket for the bowler?",
        answer:
          "Yes. LBW is one of the five dismissals credited to the bowler, along with bowled, caught, stumped and hit wicket. It goes into their bowling figures exactly like a clean bowled.",
      },
    ],
    related: [
      "how-wickets-are-credited",
      "umpire-signals-explained",
      "no-ball-and-free-hit-scoring",
      "bowling-tips-for-beginners",
    ],
  },
  {
    slug: "how-wickets-are-credited",
    title: "Which Dismissals Count for the Bowler? Wickets Explained",
    metaDescription:
      "Bowled, caught, LBW, stumped and hit wicket go to the bowler. Run outs, timed out and obstruction do not. Here is how to credit every dismissal correctly.",
    keywords:
      "wickets credited to bowler, does run out count for bowler, retired out cricket, dismissal types cricket, bowling figures wickets, retired hurt scoring",
    category: "Laws Explained",
    datePublished: "2026-09-22",
    summary:
      "Every dismissal adds a wicket to the team total, but only some of them add a wicket to the bowler's figures. This article lists all the ways a batter can be out, shows which ones belong to the bowler, and explains how retirements should be scored.",
    keyTakeaways: [
      "Five dismissals are credited to the bowler: bowled, caught, LBW, stumped and hit wicket.",
      "Run out, obstructing the field, hit the ball twice and timed out count against the team but not for any bowler.",
      "Retired out is a dismissal; retired not out (injury or illness) is not, and that batter may come back.",
      "Wides and no-balls are charged to the bowler's runs; byes and leg byes are not.",
    ],
    sections: [
      {
        heading: "The principle behind the credit",
        paragraphs: [
          "The idea is simple once you see it. A wicket goes to the bowler when the bowler's delivery itself caused the dismissal. If the ball beat the bat and hit the stumps, or was edged and caught, the bowler did the work. If the batter was run out going for a quick single, the dismissal came from the running and the fielding, not from the delivery.",
          "That is why a bowler can take a hat-trick only with dismissals credited to them. Three wickets in three balls where one is a run out is not a hat-trick for the bowler, though it may well be a memorable over for the fielding side.",
          "Scorers need to get this right because bowling figures drive everything from the man of the match award to end-of-season averages. A run out wrongly added to a bowler's column is one of the most common errors in club scorebooks.",
        ],
      },
      {
        heading: "All ten ways to be out, at a glance",
        paragraphs: [
          "The 2017 Code, as updated in 2022, recognises ten methods of dismissal including retired out. Handled the ball no longer exists as a separate method; it was folded into obstructing the field years ago, so a batter who wilfully handles the ball without the consent of the fielding side is now out obstructing.",
          "The table below is worth printing and keeping in the scorebook. The last column shows the dismissal you would write in the \"how out\" box.",
        ],
        table: {
          caption: "Dismissals and who gets the credit",
          headers: ["Dismissal", "Law", "Credited to bowler?", "Scorebook entry"],
          rows: [
            ["Bowled", "32", "Yes", "b Bowler"],
            ["Caught", "33", "Yes", "c Fielder b Bowler"],
            ["Hit wicket", "35", "Yes", "hit wicket b Bowler"],
            ["LBW", "36", "Yes", "lbw b Bowler"],
            ["Stumped", "39", "Yes", "st Keeper b Bowler"],
            ["Run out", "38", "No", "run out (Fielder)"],
            ["Hit the ball twice", "34", "No", "hit the ball twice"],
            ["Obstructing the field", "37", "No", "obstructing the field"],
            ["Timed out", "40", "No", "timed out"],
            ["Retired out", "25.4", "No", "retired out"],
          ],
        },
      },
      {
        heading: "The five that belong to the bowler",
        paragraphs: [
          "Bowled is the cleanest: the delivery breaks the wicket, even if it deflects off the bat or the batter first. Bowled takes priority over every other method, so a ball that clips the pad and hits the stumps is bowled, not LBW.",
          "Caught requires a fair catch before the ball touches the ground, and the bowler shares the credit with the fielder. A caught-and-bowled is written as \"c and b\" followed by the bowler's name. Stumped goes to the bowler and the wicketkeeper together. LBW and hit wicket are credited to the bowler alone.",
          "One quirk is worth knowing. A batter can be stumped or out hit wicket off a wide, and those wickets still count for the bowler even though the delivery was not legal. The wide run is also added to the bowler's figures.",
        ],
      },
      {
        heading: "Run outs, timed out and the other team-only wickets",
        paragraphs: [
          "A run out goes in the fall-of-wickets column and the team's wicket count, but the bowler's wicket tally does not move. Name the fielder who threw or broke the wicket in brackets so the fielding record is accurate. Running out the non-striker for leaving the crease early, which now sits in Law 38, is also a run out and is not credited to the bowler, even though the bowler is the one who breaks the wicket.",
          "Timed out happens when the incoming batter is not ready to face, or for the other batter to receive, within three minutes of the previous dismissal. Many competitions use two minutes, as the ICC does in men's internationals. Hit the ball twice and obstructing the field are rare at club level but do occur, especially with nervous juniors who pick the ball up to hand it back.",
          "Off a no-ball, the only possible dismissals are run out, hit the ball twice and obstructing the field. None of those is credited to the bowler, so a bowler can never take a wicket with a no-ball.",
        ],
        callout: {
          title: "Match scenario: stumped or run out off a wide?",
          text: "A leg-spinner bowls a wide down the leg side. The right-hander overbalances out of the crease and the keeper whips the bails off. If the batter was not attempting a run, it is stumped: wicket to the bowler, one wide added to his figures. If the batter had set off for a bye when the bails came off, it is run out instead, and the bowler gets no wicket. Same ball, same position, different credit, so always ask the umpire which one he gave.",
        },
      },
      {
        heading: "Retired out vs retired not out",
        paragraphs: [
          "Law 25.4 covers retirements, and local cricket uses them constantly. A batter who leaves the field through illness, injury or another unavoidable cause is retired not out. That is not a dismissal. They can resume their innings later, at the fall of a wicket or another retirement, and their score continues.",
          "A batter who retires for any other reason, such as giving others a turn in a friendly, can only come back with the opposing captain's consent. If they do not return, they are recorded as retired out, which counts as a wicket for the team but not for any bowler.",
          "House rules often say a batter must retire on reaching 25 or 30. That is a retirement for another reason. Decide before the match whether those batters can return once everyone else has batted, and write the rule on the scoresheet so nobody argues at the end.",
        ],
        bullets: [
          "Retired hurt: write \"retired not out\", do not add to the wickets total.",
          "Compulsory retirement in a friendly: \"retired not out\" if they may return, \"retired out\" if they may not.",
          "If the innings ends and a retired not out batter never returns, they finish as not out.",
        ],
      },
      {
        heading: "What else goes into bowling figures",
        paragraphs: [
          "Bowling figures are written overs, maidens, runs, wickets. Runs conceded include every run off the bat plus wides and no-balls. Byes and leg byes are not charged to the bowler, because the keeper or the batter's body is responsible for those, not the delivery.",
          "Penalty runs under Law 41 are never charged to the bowler either. They go in the extras line as penalties. If you use Cricket Score Counter, choosing the dismissal type when you record a wicket means the bowler's figures and the team total update correctly on their own, which removes most of the arithmetic errors described above.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does a run out count as a wicket for the bowler?",
        answer:
          "No. A run out adds to the team's wickets and the fall-of-wickets list, but it is not credited to any bowler. The fielder involved is usually named in brackets in the scorebook.",
      },
      {
        question: "Is a stumping credited to the bowler or the wicketkeeper?",
        answer:
          "Both. The scorebook shows \"st Keeper b Bowler\". The wicket counts in the bowler's figures and as a dismissal for the keeper in fielding records.",
      },
      {
        question: "Is retired hurt counted as a wicket?",
        answer:
          "No. Retiring through injury or illness is \"retired not out\" and the batter may resume later. Only \"retired out\", where a batter leaves for another reason and does not return with the opposing captain's consent, counts as a team wicket.",
      },
      {
        question: "Can a bowler take a hat-trick if one of the wickets is a run out?",
        answer:
          "No. A hat-trick is three consecutive deliveries each taking a wicket credited to the bowler. A run out in the sequence breaks it, although wides or no-balls in between do not, because they are not counted as legal deliveries.",
      },
      {
        question: "Why is hit the ball twice not credited to the bowler?",
        answer:
          "Because the dismissal comes from the batter deliberately striking the ball a second time, not from the delivery beating them. The law treats it like obstruction: a wicket for the team only.",
      },
    ],
    related: [
      "lbw-rule-explained",
      "how-to-record-a-run-out",
      "how-to-read-a-cricket-scorecard",
      "how-to-score-wides",
    ],
  },
  {
    slug: "fielding-positions-explained",
    title: "Cricket Fielding Positions Explained: Slips to Long-On",
    metaDescription:
      "Learn every cricket fielding position, from slips and gully to cover, mid-wicket and fine leg, plus the words that describe them and the leg-side rule.",
    keywords:
      "cricket fielding positions, fielding positions names, slip gully point cover, off side leg side, fine leg third man, cricket field map, fielding restrictions",
    category: "Laws Explained",
    datePublished: "2026-09-24",
    summary:
      "Fielding position names sound like a secret code until you learn the handful of words they are built from. This guide explains off side and leg side, the building-block words like fine, square, deep and silly, and then walks round the field position by position.",
    keyTakeaways: [
      "All positions are described for a right-handed batter; for a left-hander, the whole field is mirrored.",
      "The off side is the side the batter's chest faces; the leg side is behind their legs.",
      "Most names combine a base position with a modifier such as deep, short, fine, square or silly.",
      "The Laws allow no more than two fielders behind square on the leg side at the moment of delivery.",
    ],
    sections: [
      {
        heading: "Start with off side and leg side",
        paragraphs: [
          "Everything depends on which way the batter stands. A right-handed batter stands side-on with the left shoulder pointing at the bowler. The half of the ground in front of their chest is the off side, also called the offside. The half behind their legs is the leg side, often called the on side.",
          "Imagine a line running straight down the middle of the pitch and out to both sightscreens. That line splits the field in two. For a right-hander, the slips and cover are on the off side; mid-wicket and square leg are on the leg side.",
          "When a left-hander comes in, everything flips. First slip moves to the other side of the keeper, cover becomes the leg side, and the whole field swaps over. This is why fielders in a mixed-handed partnership seem to be constantly walking across the ground between overs, and sometimes after a single.",
        ],
      },
      {
        heading: "The building-block words",
        paragraphs: [
          "Once you know about eight words, you can work out almost any position name you hear. They describe how far from the batter the fielder is, and at what angle to the pitch.",
          "Angles are measured against an imaginary line through the batter's stumps at right angles to the pitch. That line is \"square\". Anything behind it, towards the keeper, is \"backward\" or \"fine\". Anything in front of it, towards the bowler, is \"forward\".",
        ],
        table: {
          caption: "Modifiers used in fielding position names",
          headers: ["Word", "Meaning", "Example"],
          rows: [
            ["Silly", "Very close to the batter, in front of the bat", "Silly point, silly mid-off"],
            ["Short", "Closer to the batter than the usual position", "Short leg, short cover"],
            ["Deep / Long", "Near the boundary", "Deep cover, long-on"],
            ["Square", "Roughly level with the batter's crease", "Square leg"],
            ["Backward", "Behind square, towards the keeper", "Backward point"],
            ["Forward", "In front of square, towards the bowler", "Forward short leg"],
            ["Fine", "Close to the line of the pitch, behind the batter", "Fine leg"],
            ["Wide / Extra", "Further from the line of the pitch than usual", "Extra cover, wide slip"],
          ],
        },
      },
      {
        heading: "Behind the bat: keeper, slips, gully and third man",
        paragraphs: [
          "The wicketkeeper stands behind the striker's stumps, either right up to them for spinners or several metres back for faster bowlers. Next to the keeper, on the off side, stand the slips, numbered outward: first slip, second slip, third slip. Their job is catching outside edges.",
          "Gully stands wider and a little further back than the slips, catching edges that fly squarer or harder. Further out still, near the boundary behind the slips, is third man, who saves runs from edges and late cuts that beat the cordon.",
          "On the leg side, the equivalent close catcher is leg slip, which is mostly used for spinners or bowlers attacking the body. Fine leg sits on the leg-side boundary behind the batter, mirroring third man. Short fine leg is the same angle but inside the circle.",
        ],
      },
      {
        heading: "The off side: point, cover and mid-off",
        paragraphs: [
          "Moving round in front of square on the off side, point stands roughly level with the batter, a short distance away. Backward point is a little behind square and is a favourite spot for your sharpest fielder. Silly point is right under the batter's nose for spin.",
          "Cover point, cover and extra cover sit in an arc between point and mid-off, saving the runs from drives. Cover is often the busiest position in club cricket because so many batters drive through the off side.",
          "Mid-off stands on the off side of the bowler, about level with the bowler's run-up and inside the circle. Push them back to the boundary and they become long-off. A fielder on the off-side boundary square of the wicket is deep point or, in limited-overs language, the sweeper.",
        ],
      },
      {
        heading: "The leg side: square leg, mid-wicket and mid-on",
        paragraphs: [
          "Square leg is the leg-side mirror of point, level with the batter's crease. It is also where the second umpire stands, so the fielder normally stands a little in front or behind. Short leg, or forward short leg, crouches very close for bat-pad catches, always in a helmet.",
          "Mid-wicket sits between square leg and mid-on, protecting the area where batters whip balls off their pads. Mid-on is the mirror of mid-off. Send them back and you have long-on. Deep mid-wicket and deep square leg patrol the leg-side boundary for the pull and the slog.",
          "\"Cow corner\" is the informal name for the deep area between deep mid-wicket and long-on, where agricultural slogs tend to land. It is not an official term but every gully team uses it.",
        ],
        callout: {
          title: "Match scenario: setting a field for a medium-pacer",
          text: "T20 club match, right-handed batter, medium-pacer bowling a fourth-stump line. A sensible field: keeper, one slip, point, cover, mid-off and mid-on inside the circle; third man, deep square leg, fine leg and long-on outside. That is two leg-side fielders behind square (deep square leg and fine leg), which is the legal maximum. When a left-hander takes strike, swap slip, point and cover to the other side, move third man and fine leg across, and recheck the leg-side count before the bowler runs in.",
        },
      },
      {
        heading: "Rules the umpire and captain must watch",
        paragraphs: [
          "Under Law 28, no more than two fielders, not counting the keeper, may be behind square on the leg side at the instant the bowler delivers. Breaking this is a no-ball. The rule dates from the Bodyline series and stops captains packing the leg side behind the batter.",
          "No fielder may have any part of their body on or over the pitch until the ball has touched the bat or passed the batter. Fielders may move a little as the bowler runs in, but significant movement before the ball reaches the batter will see the umpire call and signal dead ball.",
          "Limited-overs competitions add fielding restrictions through playing conditions rather than the Laws, usually based on a 30-yard circle. Local leagues set their own versions. Make sure both captains know how many fielders may be outside the circle in each phase before the toss.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the difference between point and cover?",
        answer:
          "Point stands roughly square of the batter on the off side. Cover is further forward, between point and mid-off, and covers the area where off drives go. Cover point is the position halfway between them.",
      },
      {
        question: "Where does third man field?",
        answer:
          "Third man is on the off-side boundary behind the batter, roughly in line with the slips. The position saves runs from thick edges and late cuts that fly past the slip cordon.",
      },
      {
        question: "Why do fielders move when a left-hander comes in?",
        answer:
          "Because off side and leg side are defined by the batter, not by the ground. A left-hander's off side is on the opposite side to a right-hander's, so every position is mirrored across the pitch.",
      },
      {
        question: "How many slips can a team have?",
        answer:
          "The Laws set no limit on slips. The only placement limits are the two-behind-square-on-the-leg-side rule, the ban on fielders encroaching on the pitch, and any circle restrictions in the playing conditions.",
      },
      {
        question: "What happens if there are three fielders behind square on the leg side?",
        answer:
          "The square leg umpire calls and signals no-ball. The batting side receives the one-run no-ball penalty, the next delivery is a free hit where playing conditions use them, and the delivery does not count in the over.",
      },
    ],
    related: [
      "powerplay-strategy",
      "death-overs-bowling-tips",
      "umpire-signals-explained",
    ],
  },
  {
    slug: "umpire-signals-explained",
    title: "Umpire Signals Explained: Every Signal a Scorer Must Know",
    metaDescription:
      "A scorer's guide to cricket umpire signals: four, six, wide, no-ball, bye, leg bye, dead ball, short run, penalty runs, revoke and more, with recording tips.",
    keywords:
      "umpire signals, cricket umpire signals list, bye signal, leg bye signal, short run signal, penalty runs signal, dead ball signal, scorer acknowledgement",
    category: "Laws Explained",
    datePublished: "2026-09-26",
    summary:
      "Umpires talk to scorers almost entirely through hand signals. This guide lists every signal in the Laws plus the common playing-condition signals, explains the order in which they arrive, and shows how a scorer should turn a sequence of signals into the correct entry.",
    keyTakeaways: [
      "Wide and no-ball are signalled while the ball is in play; most other signals come once the ball is dead.",
      "Scorers must acknowledge every signal, and the umpire should wait for that acknowledgement.",
      "Combined signals are common: a no-ball followed by a four means one no-ball plus four runs to the batter.",
      "If the umpire touches both shoulders with crossed arms, cancel the previous signal.",
    ],
    sections: [
      {
        heading: "Why signals matter so much to the scorer",
        paragraphs: [
          "Law 2 makes the umpires responsible for the conduct of the game, and Law 3 makes the scorers responsible for recording it accurately. The link between the two is the signal. The scorer is not supposed to decide what happened; they record what the umpire signals, even if they saw something different from the boundary.",
          "That makes signals the most practical part of the Laws for anyone with a scorebook or a phone. In club cricket you might be sitting forty metres away, behind a sightscreen, with players walking in front of you. Knowing exactly what each signal means, and what order they come in, lets you record a complicated ball in seconds.",
          "Scorers must acknowledge each signal before play continues, traditionally by raising a hand. At grounds with no proper scorers' box, a wave from the boundary is enough. A good umpire will not let the bowler run in until he has seen it.",
        ],
      },
      {
        heading: "The full list of signals",
        paragraphs: [
          "The table covers the signals in the Laws, plus three that come from playing conditions you will often meet: free hit, TV replay and the third-umpire review. Practise the ones that look similar, especially bye versus out and the two penalty-run signals.",
        ],
        table: {
          caption: "Umpire signals and what to record",
          headers: ["Signal", "How it looks", "What to record"],
          rows: [
            ["Out", "Index finger raised above the head", "Wicket; ask for dismissal type if unclear"],
            ["Boundary four", "Arm waved side to side across the chest", "Four runs, to bat or to extras"],
            ["Boundary six", "Both arms raised straight above the head", "Six runs to the batter"],
            ["Wide", "Both arms stretched out horizontally", "One wide plus any runs as wides"],
            ["No-ball", "One arm stretched out horizontally", "One no-ball plus runs"],
            ["Bye", "Open hand raised above the head", "Byes, not charged to bowler"],
            ["Leg bye", "Hand touches a raised knee", "Leg byes, not charged to bowler"],
            ["Dead ball", "Wrists crossed and uncrossed below the waist", "Usually nothing; ball may not count"],
            ["Short run", "Arm bent, fingertips touching the nearer shoulder", "Deduct one run per signal"],
            ["Five penalty runs to batting side", "One shoulder tapped repeatedly with the other hand", "Five penalty extras to batting side"],
            ["Five penalty runs to fielding side", "One hand placed on the opposite shoulder", "Five penalty runs to fielding side"],
            ["Revoke last signal", "Both shoulders touched with arms crossed", "Cancel the previous signal"],
            ["New ball", "Ball held above the head", "Note the over the new ball was taken"],
            ["Free hit", "One finger raised and circled above the head", "Next ball is a free hit"],
            ["TV replay", "A rectangle drawn in the air", "Wait for third umpire's decision"],
          ],
        },
      },
      {
        heading: "Signals during play and after the ball is dead",
        paragraphs: [
          "Two signals are given while the ball is still live: no-ball and wide. The umpire calls them aloud and signals at once so the batters know a free run or a free swing is on. Once the ball is dead, the umpire repeats them for the scorers.",
          "Everything else, including boundaries, byes, leg byes and short runs, is signalled only after the ball is dead. The umpire usually turns to face the scorers and gives the signals one after the other, then waits.",
          "Out is a little different. It is a response to an appeal rather than a message to the scorers, so it is given to the players. If you did not see how the batter was out, ask at the next break rather than guessing.",
        ],
      },
      {
        heading: "Reading combined signals",
        paragraphs: [
          "The trickiest moments come when two or three signals arrive together. The rule of thumb is that the first signal tells you what kind of ball it was, and the next ones tell you what happened to the runs.",
          "Note that a four signal on its own always means four runs to the batter. It is only when it follows a bye, leg bye or wide that the four becomes extras.",
        ],
        bullets: [
          "No-ball, then four: one no-ball extra plus four runs to the batter. That is five in total, and all five are charged to the bowler.",
          "Wide, then four: five wides in total, all charged to the bowler.",
          "Bye, then four: four byes, not charged to the bowler or credited to the batter.",
          "No-ball, then bye: the no-ball extra plus any byes run, none to the batter.",
          "Two runs completed, then short run: one run scored, and the batters stay at the ends they reached.",
        ],
        callout: {
          title: "Match scenario: a no-ball, leg bye and short run in one delivery",
          text: "The bowler oversteps. The ball hits the batter's thigh and runs away, and the batters run two, but the striker turns without grounding his bat for the first. After the ball is dead, the umpire gives: no-ball, leg bye, short run. Record one no-ball extra plus one leg bye. Nothing goes to the batter, the bowler is charged one run for the no-ball, and the ball does not count in the over. The batters end where they finished running, at their original ends, so the same striker faces the next ball, which is a free hit if your competition uses them.",
        },
      },
      {
        heading: "Signals in local, school and gully cricket",
        paragraphs: [
          "In many local games the umpire is a batter from the side waiting to bat, wearing pads and holding a phone. Signals still matter, arguably more, because both teams need to trust the scoring. Agree before the match that the umpire will signal every extra clearly and that the scorer will acknowledge it, even with just a nod.",
          "Box and tape-ball formats often add house rules that have no official signal, such as a run for hitting the side net or an automatic wicket for hitting the roof. Agree a simple gesture for each one at the toss. Otherwise, use the standard signals and keep the meanings unchanged; inventing a new meaning for the bye signal will only confuse the next scorer.",
          "School matches are a good place to teach signals properly. Ask young umpires to hold each signal for a full second and to face the scorers squarely. Those habits stay with them, and the scorebook ends up far tidier for it.",
        ],
      },
      {
        heading: "When the umpire changes his mind",
        paragraphs: [
          "Umpires do occasionally signal the wrong thing, such as a bye when the ball actually brushed the pad. The revoke signal, both shoulders touched with crossed arms, means \"ignore what I just showed you\". The correct signal should follow straight after.",
          "If you are using Cricket Score Counter, this is exactly what the undo button is for: remove the last entry and record it again with the right extra type. In a paper book, cross out neatly and write the correction alongside so the other scorer can follow it at the break.",
          "If you missed a signal altogether, do not guess. Call out to the umpire or agree the entry with the opposition scorer at the end of the over. Cross-checking the total, wickets and overs with the other scorer every few overs prevents most end-of-match disputes.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the difference between the bye and leg bye signals?",
        answer:
          "For a bye the umpire raises an open hand above the head. For a leg bye he lifts one knee and touches it with his hand. Both mean the runs go to extras, not to the batter or the bowler.",
      },
      {
        question: "Is the free hit signal part of the Laws of Cricket?",
        answer:
          "No. Free hits come from playing conditions used in limited-overs cricket, and so does the circling-finger signal. Plenty of local leagues use them, but check your competition rules.",
      },
      {
        question: "How does an umpire signal a short run?",
        answer:
          "He bends one arm upwards and touches the nearer shoulder with his fingertips. One signal means one run is deducted; if two runs were short, he signals twice.",
      },
      {
        question: "Why does the umpire wait after signalling?",
        answer:
          "He is waiting for the scorers to acknowledge the signal. Law 2 requires him to make sure each signal has been seen before he lets play continue, which avoids disputes over the total later on.",
      },
    ],
    related: [
      "dead-ball-and-short-runs",
      "byes-and-leg-byes-explained",
      "no-ball-and-free-hit-scoring",
      "how-to-score-wides",
    ],
  },
  {
    slug: "duckworth-lewis-stern-explained",
    title: "Duckworth-Lewis-Stern (DLS) Method Explained Simply",
    metaDescription:
      "How the DLS method sets revised targets in rain-hit matches: resources, overs and wickets, par scores and why local cricket usually needs a simpler method.",
    keywords:
      "dls method explained, duckworth lewis stern, dls par score, rain rule cricket, revised target cricket, resources overs wickets, duckworth lewis calculation",
    category: "Laws Explained",
    datePublished: "2026-09-28",
    summary:
      "DLS is the system used in international and most professional limited-overs cricket to reset targets when weather cuts overs. The maths behind it is complex, but the idea is simple: a team's scoring potential depends on both the overs and the wickets it has left. This guide explains that idea, the terms you will hear, and when DLS is and is not the right tool.",
    keyTakeaways: [
      "DLS measures batting \"resources\" as a combination of overs remaining and wickets in hand.",
      "Revised targets are based on the ratio of resources each team had, not simply on run rate.",
      "The par score tells you who would win if no more play were possible at that moment.",
      "Official targets come from licensed software; local matches usually use simpler, agreed methods.",
    ],
    sections: [
      {
        heading: "Where DLS came from",
        paragraphs: [
          "Before the 1990s, rain-affected one-day matches used crude rules such as average run rate or \"most productive overs\". Both produced absurd results. The most famous was the 1992 World Cup semi-final, where South Africa needed 22 off 13 balls before a short rain delay and were left needing an impossible target off a single ball when play resumed.",
          "Two English statisticians, Frank Duckworth and Tony Lewis, designed a fairer method that was first used in international cricket in 1997. After they retired, Australian statistician Steven Stern became the custodian of the method, and in 2014 it was renamed Duckworth-Lewis-Stern. It is now the standard for ICC limited-overs matches and most domestic competitions.",
          "Stern still maintains and updates the model as scoring patterns change. That matters, because T20 scoring today looks nothing like one-day cricket in the 1990s, and the method has to keep pace with how teams actually bat.",
        ],
      },
      {
        heading: "The core idea: resources, not just overs",
        paragraphs: [
          "The key insight is that a batting side has two resources: overs remaining and wickets in hand. Losing overs hurts, but how much it hurts depends on wickets. Ten overs left with eight wickets in hand is worth a great deal. Ten overs left with one wicket in hand is worth much less, because the last pair cannot attack freely.",
          "DLS expresses a team's remaining potential as a percentage of the full resources it had at the start of the innings. At the first ball of a 50-over innings, a team has all of its resources. Every ball bowled and every wicket lost uses some up. When rain removes overs, it removes the resources those overs would have provided.",
          "The exact percentage for each combination of overs and wickets comes from a published table built from historical scoring data. Those values are not something to estimate from memory, and the Professional Edition used at the top level is run through software rather than looked up by hand.",
        ],
      },
      {
        heading: "How a revised target is worked out",
        paragraphs: [
          "The basic principle is a comparison. If the side batting second has fewer resources available than the side batting first had, its target is scaled down in proportion. If, for example, Team 2 ends up with three-quarters of the resources Team 1 used, its par score is roughly three-quarters of Team 1's total.",
          "When Team 2 has more resources than Team 1, which can happen when Team 1's innings was cut short unexpectedly, the target goes up. In that case the method adds runs based on an average score for the level of cricket, rather than simply scaling up, so that a very low first-innings score is not multiplied into something silly.",
          "The par score is usually a decimal. The target is the next whole number above it. If Team 2 finishes exactly on the whole-number part of par, the match is a tie.",
        ],
        steps: [
          "Record the overs available and wickets lost at every interruption in both innings.",
          "Enter those details into DLS software at each stoppage.",
          "Read off the par score at that point and the revised target for any reduced innings.",
          "Announce the new target and overs to both captains and the scorers before play restarts.",
        ],
      },
      {
        heading: "Par scores during an innings",
        paragraphs: [
          "During a chase, television shows a \"DLS par score\" that changes ball by ball. It answers one question: if play stopped for good right now, what score would Team 2 need to be on to win? Par goes up quickly when wickets fall, because each lost wicket uses up resources.",
          "Captains watch par closely when rain is forecast. A chasing side ahead of par can afford to play safely before a storm. A side behind par needs to take risks, but every wicket lost pushes par higher still, which is a tension the method is designed to create.",
        ],
        callout: {
          title: "Match scenario: why wickets matter as much as runs",
          text: "Team 1 makes 260 in 50 overs. Team 2 reaches 130 after 25 overs, so it is exactly on the required run rate. Under a simple run-rate method, it would be level. Under DLS, the answer depends on wickets. If Team 2 is 130 for 1, it is well ahead of par, because nine wickets in hand for the last 25 overs is a big resource. If Team 2 is 130 for 6, it is behind par, because the tail is exposed. Same runs, same overs, opposite results if rain ends the match.",
        },
      },
      {
        heading: "Common misunderstandings",
        paragraphs: [
          "DLS does not favour the chasing side or the side batting first by design. It tries to set a target that is equally hard to reach as the original one, given what was lost. Results can still feel unfair, especially when an interruption comes at a moment that suited one team.",
          "A minimum number of overs is needed before DLS can produce a result. Under ICC playing conditions, that is 20 overs per side in a one-day international and five overs per side in a T20 international. Below that, it is a no result.",
        ],
        table: {
          caption: "DLS terms you will hear",
          headers: ["Term", "Meaning"],
          rows: [
            ["Resources", "Combined value of overs remaining and wickets in hand"],
            ["Par score", "The score Team 2 needs to be level at that moment if no more play happens"],
            ["Revised target", "Par plus one, rounded to a whole number, for a reduced innings"],
            ["Professional Edition", "The software-based version used in ICC and top-level matches"],
            ["Standard Edition", "The older, table-based version used where software is not available"],
          ],
        },
      },
      {
        heading: "Should local cricket use DLS?",
        paragraphs: [
          "For most club, school and gully matches, the honest answer is no. DLS assumes two teams playing to the scoring patterns of professional cricket, and it needs careful records of every interruption. A 10-over tennis-ball game played on a half-flooded ground is not what it was built for.",
          "Simpler methods work well locally: average run rate, a target based on runs scored in the same number of overs, or a pre-agreed par table for your league. What matters most is agreeing the method before the toss. Keep an accurate over-by-over record of runs and wickets; Cricket Score Counter does this automatically, and it gives you the numbers any method needs if rain arrives.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Duckworth-Lewis the same as DLS?",
        answer:
          "Yes, DLS is the current version of the Duckworth-Lewis method. It was renamed in 2014 when Steven Stern took over as its custodian and updated the model for modern scoring rates.",
      },
      {
        question: "Can I calculate DLS by hand?",
        answer:
          "The older Standard Edition could be done with a printed resource table, but the Professional Edition used in ICC matches requires software. For an official result you should rely on the licensed software rather than estimates.",
      },
      {
        question: "Why did the target go up after a rain delay in the first innings?",
        answer:
          "If Team 1 lost overs unexpectedly while it still had wickets in hand, it was denied resources it planned to use. Team 2, knowing its overs in advance, effectively has more resources, so the target is raised to compensate.",
      },
      {
        question: "What happens if Team 2 finishes exactly on par?",
        answer:
          "The match is a tie. The target is always one more than the whole-number par score, so reaching par but not the target means the scores are level under DLS.",
      },
      {
        question: "Does DLS work for T20?",
        answer:
          "Yes. The same model is used for T20 internationals and most professional T20 leagues, with a minimum of five overs per side needed to produce a result under ICC playing conditions.",
      },
    ],
    related: [
      "shortened-match-targets",
      "chasing-a-target-required-run-rate",
      "net-run-rate-explained",
      "super-over-and-tie-rules",
    ],
  },
  {
    slug: "dead-ball-and-short-runs",
    title: "Dead Ball, Short Runs and Penalty Runs Explained",
    metaDescription:
      "When is the ball dead? What counts as a short run? Who gets five penalty runs and how are they scored? A practical guide to Laws 18, 20 and 41 for scorers.",
    keywords:
      "dead ball cricket, short run cricket, one short, penalty runs cricket, five penalty runs, law 20 dead ball, law 18 short runs, law 41 unfair play",
    category: "Laws Explained",
    datePublished: "2026-09-30",
    summary:
      "Dead balls, short runs and penalty runs are three of the least understood parts of the Laws, and all three change the score in ways that catch out new scorers. This guide explains when the ball becomes dead, how short runs are deducted, and when five penalty runs are awarded and to whom.",
    keyTakeaways: [
      "The ball becomes dead automatically in many situations; the umpire only needs to call it in some of them.",
      "A short run is deducted from the score, but the batters stay at the ends they reached.",
      "Deliberate short running costs the batting side all runs from that ball plus five penalty runs to the fielding side.",
      "Penalty runs are extras: never credited to a batter or charged to a bowler.",
    ],
    sections: [
      {
        heading: "When the ball becomes dead on its own",
        paragraphs: [
          "Law 20 lists the moments when the ball becomes dead without anyone saying a word. The most common is when it is finally settled in the hands of the wicketkeeper or the bowler. \"Finally settled\" is a judgement for the umpire: a keeper juggling the ball while a batter considers a bye has not settled it.",
          "The ball is also automatically dead when a boundary is scored, when a batter is dismissed, when it lodges in a batter's clothing or equipment or the umpire's clothing, and when it lodges in a fielder's helmet. Once it is dead, nothing that happens afterwards can produce runs or wickets until the next delivery.",
          "This matters for run outs in particular. If the keeper has the ball settled in his gloves and the batters have stopped, a later wild throw at the stumps cannot run anyone out. The ball was dead before the throw.",
        ],
      },
      {
        heading: "When the umpire calls dead ball",
        paragraphs: [
          "In other situations, the umpire has to call and signal dead ball, crossing and uncrossing the wrists below the waist. Some of these calls mean the delivery does not count in the over at all, so the scorer must watch closely.",
          "The 2022 update added a useful one for local cricket: the umpire can call dead ball if either side is disadvantaged by a person, animal or other object within the field of play. A stray dog chasing the ball in a park match is now clearly covered.",
        ],
        bullets: [
          "The striker was not ready for the delivery and did not attempt to play it.",
          "The ball falls from the bowler's hand before delivery, or the bowler does not deliver it for any reason.",
          "A player or umpire is seriously injured.",
          "A batter is distracted by noise or movement during the delivery.",
          "Unfair play has occurred that the Laws say should result in dead ball.",
          "An object or animal interferes with play and disadvantages either side.",
        ],
      },
      {
        heading: "What a short run is",
        paragraphs: [
          "Law 18.3 defines a short run. A run is short if a batter, turning for a further run, fails to make good ground at the end where they turned. In plain terms, they turned without grounding their bat or body behind the popping crease.",
          "Only the run that was short is lost. If the batters ran three and one was short, two runs count. If both batters ran short on the same run, it is still only one short run. The last run cannot be short, because the batters are not turning for another; if they stop short of the crease on the final run, that run is simply not completed.",
          "Crucially, a short run does not change which end the batters finish at. If they physically ran two and one was short, they are back at their original ends, even though only one run is scored. That is the most common scoring mistake on this topic, so check strike carefully.",
        ],
        table: {
          caption: "Short runs: what is scored and who faces",
          headers: ["Ran", "Short", "Runs scored", "Ends at finish"],
          rows: [
            ["2", "1", "1", "Original ends; same striker faces"],
            ["3", "1", "2", "Swapped; other batter faces"],
            ["3", "2", "1", "Swapped; other batter faces"],
            ["4", "1", "3", "Original ends; same striker faces"],
          ],
        },
      },
      {
        heading: "Deliberate short running",
        paragraphs: [
          "Law 18.5 deals with batters who run short on purpose, or who deliberately run a run without trying to make good ground so they can keep the strike. This is treated as unfair play. The umpire disallows all runs from that delivery, sends the batters back to their original ends, and awards five penalty runs to the fielding side.",
          "Any no-ball or wide still stands, as does any other five-run penalty, but the runs the batters tried to gain are lost. The umpire also reports the incident to the captain and the relevant authorities.",
        ],
        callout: {
          title: "Match scenario: protecting the tail",
          text: "Last over of a 20-over match. The set batter hits the ball to deep cover with three balls left and wants to keep strike. The batters run two, but the non-striker deliberately turns well short of the crease on the first run so that one is scored and the set batter stays on strike. The bowler's end umpire judges it deliberate. All runs are disallowed, the batters return to their original ends, and five penalty runs are added to the fielding side's total. Nothing is added to the batting total from that ball.",
        },
      },
      {
        heading: "Penalty runs: who gets five and why",
        paragraphs: [
          "Law 41 and a few related Laws award five penalty runs for unfair play. These are not the same as the one-run penalty for a wide or no-ball. They are a separate category, recorded as penalty extras, and they are not charged to any bowler or credited to any batter.",
          "The batting side gets five when the fielding side breaks the rules, such as a fielder stopping the ball with a cap, the ball hitting a fielding helmet left on the ground, deliberate fake fielding to distract a batter, or changing the condition of the ball. The fielding side gets five for batting offences: deliberate short running, a batter attempting to steal a run during the bowler's run-up, or repeated damage to the pitch or time wasting after a warning.",
          "Five runs awarded to the fielding side are added to that side's most recently completed innings. If they have not batted yet, the runs go on their next innings. In a one-innings limited-overs match, that means a fielding side that has already batted simply has five added to its total.",
        ],
      },
      {
        heading: "Recording all of this correctly",
        paragraphs: [
          "Treat the umpire's signals as your source of truth. Short run, five runs to the batting side and five runs to the fielding side all have their own signals, and the umpire should show them once the ball is dead. Acknowledge each one before play restarts.",
          "On paper, write penalty runs in the extras box with a clear note of which side received them. With Cricket Score Counter, recording the correct extra type keeps batter and bowler figures clean; if a later signal changes the picture, use undo and re-enter the ball rather than patching the total.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does a dead ball count as one of the six balls in an over?",
        answer:
          "It depends on why it was called. If the umpire calls dead ball before the striker has had a chance to play the ball, such as for a distraction or the striker not being ready, the delivery does not count. A ball that becomes dead normally at the end of play counts as usual.",
      },
      {
        question: "Can a batter be run out after the ball is dead?",
        answer:
          "No. Once the ball is dead, no dismissal is possible until the next delivery comes into play. This is why umpires watch for the moment the keeper has the ball finally settled.",
      },
      {
        question: "Are penalty runs added to the bowler's figures?",
        answer:
          "No. Five-run penalties are extras. They are never charged to the bowler, even when a fielder causes them while that bowler is bowling.",
      },
      {
        question: "What happens if both batters run short on the same run?",
        answer:
          "It is treated as one short run. Only one run is deducted, however many batters failed to make their ground on that particular run.",
      },
      {
        question: "Is the one run for a wide or no-ball a penalty run?",
        answer:
          "It is a penalty in everyday language, but it is not a Law 41 penalty. The one-run wide or no-ball extra is charged to the bowler, while five-run penalties are not charged to anyone.",
      },
    ],
    related: [
      "umpire-signals-explained",
      "overthrows-in-cricket",
      "strike-rotation-explained",
      "byes-and-leg-byes-explained",
    ],
  },
  {
    slug: "super-over-and-tie-rules",
    title: "Ties, Super Overs and Bowl-Outs: Deciding Tied Matches",
    metaDescription:
      "What counts as a tie, how a Super Over works under ICC playing conditions, what happens if the Super Over is tied, and fair tie-breakers for local cricket.",
    keywords:
      "super over rules, tied match cricket, super over tied, bowl out cricket, tie breaker cricket, tie vs draw cricket, how super over works",
    category: "Laws Explained",
    datePublished: "2026-10-02",
    summary:
      "A tie is rare, but when it happens everyone wants to know the rules at once. This guide explains what the Laws say about ties and draws, how the Super Over works in ICC competitions, and how local leagues can settle tied games fairly without arguments.",
    keyTakeaways: [
      "Under the Laws a tie is a valid result; a Super Over only happens if the competition's playing conditions require one.",
      "In ICC Super Overs, each side faces one over with three batters, and two wickets end the innings.",
      "If a Super Over is tied, another is played, and the boundary-count tie-breaker no longer applies.",
      "Bowl-outs are historical at international level but can still be a fair local tie-breaker.",
    ],
    sections: [
      {
        heading: "What the Laws say about a tie",
        paragraphs: [
          "Law 16 covers results. A match is tied when the scores are equal at the end of the match and the side batting last has completed its innings. In a limited-overs game, that usually means the chasing side finishes its overs, or is bowled out, on exactly the same total.",
          "A tie is different from a draw. A draw is an unfinished match, common in multi-day and timed cricket, where the side batting last has not been bowled out and has not reached the target. In a draw the scores need not be level at all.",
          "The Laws themselves do not require a tie to be broken. A tie is a perfectly good result, and many leagues simply split the points. Super Overs, bowl-outs and other tie-breakers come from competition playing conditions, so the first question in any tied match is always: what do our rules say?",
        ],
        table: {
          caption: "Tie, draw and no result compared",
          headers: ["Result", "When it happens", "Typical league points"],
          rows: [
            ["Win", "One side scores more runs and the match is completed", "Full points to winner"],
            ["Tie", "Scores level and side batting last has completed its innings", "Points shared, unless a tie-breaker is used"],
            ["Draw", "Time runs out without a result in timed or multi-day cricket", "Set by league rules"],
            ["No result", "Not enough play for a result, often due to weather", "Points shared or none"],
          ],
        },
      },
      {
        heading: "How the Super Over works",
        paragraphs: [
          "The Super Over is the standard tie-breaker in ICC white-ball cricket and most professional T20 leagues. Each team bats for one over, and the team with more runs wins. It is short, dramatic and easy to understand, which is why so many local leagues have copied it.",
          "The details below follow ICC playing conditions, which other competitions often adapt. If you run a league, write your own version into the rules so captains are not reading them off a phone at the end of a match.",
        ],
        steps: [
          "Both captains nominate three batters and one bowler for their Super Over.",
          "The team that batted second in the match bats first in the Super Over.",
          "Each side faces one over. Losing two wickets ends the side's Super Over immediately.",
          "Normal extras apply, and a wide or no-ball means an extra delivery as usual.",
          "The side with more runs from its over wins the match.",
        ],
      },
      {
        heading: "When the Super Over is tied too",
        paragraphs: [
          "Until 2019, a tied Super Over in ICC events was decided by the number of boundaries each side had hit across the match and the Super Over. That rule decided the 2019 men's World Cup final in England's favour against New Zealand, and the outcry led the ICC to change it.",
          "Under the current ICC playing conditions, if a Super Over is tied, another Super Over is played, and this repeats until there is a winner. Any batter dismissed in an earlier Super Over cannot bat in the next one, and the bowler from the previous Super Over cannot bowl the next one. If time or weather stops the Super Overs being completed, the match is recorded as a tie.",
          "Runs and wickets from a Super Over do not normally count in individual batting or bowling records. They decide the match only. Keep them on a separate part of the scoresheet so they do not end up in a player's season average.",
        ],
        callout: {
          title: "Match scenario: a double Super Over in a club T20",
          text: "Both teams finish on 154. In the Super Over, the chasing team from the main match bats first and scores 11 for 1. The other team also scores 11, losing one wicket. Under ICC-style rules, a second Super Over follows. The batter dismissed in the first Super Over cannot bat again, and neither bowler from the first Super Over can bowl. The team that batted second in the first Super Over now bats first. They score 8, and the other side wins off the fourth ball. Record both Super Overs separately; the main scorecard still reads 154 each.",
        },
      },
      {
        heading: "Scoring and umpiring a Super Over",
        paragraphs: [
          "Start a fresh section of the scoresheet, or a new innings in your app, for each Super Over. Write the three nominated batters and the bowler at the top before the first ball. It sounds fussy, but it saves an argument when a captain tries to send in a fourth batter after two quick wickets.",
          "Umpires usually stay at the same ends they finished the match at, and fielding restrictions normally follow those for the last over of the main innings. Teams typically use the ball from the end of the match or a spare of similar age, which is worth agreeing before you begin, especially in tennis-ball cricket where balls go soft quickly.",
          "Check the total twice before announcing the target. A Super Over decided by a scoring slip, such as a missed wide or a leg bye recorded as runs off the bat, is the worst possible ending to a close match. Read the over back ball by ball with the other scorer before anyone shakes hands.",
        ],
      },
      {
        heading: "Bowl-outs: a short history",
        paragraphs: [
          "Before Super Overs, some competitions used a bowl-out. Five bowlers from each side bowled at an unguarded set of stumps, and the team that hit the stumps more often won. It was quick and needed no batting, which made it useful when a rain-ruined match had to produce a winner.",
          "The most famous international bowl-out came at the 2007 World Twenty20, when India beat Pakistan after a tied group game. The ICC replaced bowl-outs with the Super Over soon afterwards, because a contest of bowling at empty stumps did not reflect the game that had just been played.",
          "Bowl-outs still have a place locally. They can be played indoors or in a small dry area when the outfield is too wet for a Super Over, and they are a fair, fun way to separate two school teams who finished level.",
        ],
      },
      {
        heading: "Fair tie-breakers for local leagues",
        paragraphs: [
          "Whatever you choose, agree it before the season or at the latest at the toss. Changing tie-breakers after a tie is the fastest way to lose a team from your league. Write the rule on the match sheet and make sure both scorers know it.",
          "Using a scoring app makes the end of a tight game easier. Cricket Score Counter keeps the extras and wickets accurate ball by ball, so when the scores are level there is no dispute about whether it was really a tie before the Super Over starts.",
        ],
        bullets: [
          "Super Over: best for T20 and shorter matches with time and light remaining.",
          "Fewer wickets lost: simple, but favours sides that bat conservatively.",
          "Bowl-out: good for wet outfields and junior cricket.",
          "Shared points: the fairest option in league tables when no tie-breaker is agreed.",
        ],
      },
    ],
    faqs: [
      {
        question: "Who bats first in a Super Over?",
        answer:
          "Under ICC playing conditions, the team that batted second in the main match bats first in the Super Over. Local leagues can set their own rule, but most follow this one.",
      },
      {
        question: "What happens if the Super Over is a tie?",
        answer:
          "In ICC matches, another Super Over is played, repeating until there is a winner. The old boundary-count rule from the 2019 World Cup final was removed after that match.",
      },
      {
        question: "How many wickets does each team have in a Super Over?",
        answer:
          "Each side nominates three batters, so losing two wickets ends that side's Super Over even if balls remain. A run out counts towards those two wickets like any other dismissal.",
      },
      {
        question: "Is a tie the same as a draw in cricket?",
        answer:
          "No. A tie means the scores are level at the end of a completed match. A draw means the match ended without a result, usually because time ran out before the side batting last was bowled out or reached its target.",
      },
      {
        question: "Do Super Over runs count in a player's career stats?",
        answer:
          "Generally no. Super Over runs and wickets decide the match but are not added to the main scorecard or to players' official batting and bowling records.",
      },
    ],
    related: [
      "death-overs-bowling-tips",
      "duckworth-lewis-stern-explained",
      "chasing-a-target-required-run-rate",
      "how-to-organise-a-local-cricket-match",
    ],
  },
];
