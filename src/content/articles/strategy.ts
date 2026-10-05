import { Article } from "../articleTypes";

export const strategyArticles: Article[] = [
  {
    slug: "net-run-rate-explained",
    title: "Net Run Rate Explained with Worked Examples",
    metaDescription:
      "Learn how net run rate is calculated, why an all-out team counts its full quota of overs, and how to convert 18.4 overs correctly, with worked examples.",
    keywords:
      "net run rate, NRR calculation, how to calculate net run rate, cricket NRR formula, NRR all out rule, tournament points table cricket",
    category: "Strategy & Skills",
    datePublished: "2026-09-20",
    summary:
      "Net run rate separates teams that finish level on points. It compares how fast you score with how fast your opponents score against you, across the whole tournament. This guide walks through the formula, the overs conversion and the all-out rule, with full worked numbers.",
    keyTakeaways: [
      "NRR = (total runs scored / total overs faced) minus (total runs conceded / total overs bowled), added up across all matches.",
      "Overs must be converted to true decimals: 18.4 overs is 18 and 4/6, which is 18.667, not 18.4.",
      "A team that is bowled out is treated as having faced its full quota of overs, however early it collapsed.",
      "Add up runs and overs across the tournament first, then divide. Never average the NRR from each match.",
      "Small margins matter: one extra over of fielding or a quicker chase can move a team up the table."
    ],
    sections: [
      {
        heading: "What net run rate actually measures",
        paragraphs: [
          "In most league and group-stage formats, teams first get sorted by points. When two or more sides finish level, the usual tie-breaker is net run rate, or NRR. It tells you how quickly a team scored compared with how quickly it was scored against.",
          "A positive NRR means you scored faster than your opponents across the tournament. A negative NRR means the opposite. A team that wins narrowly every time can end up with a lower NRR than a team that lost once but won its other games by big margins.",
          "That is why NRR is worth understanding before the last round of a league, not after it. Captains who know the numbers can plan whether they need to chase quickly or restrict the opposition to a certain total. Organisers who know the numbers can settle arguments in seconds."
        ]
      },
      {
        heading: "The formula, step by step",
        paragraphs: [
          "The formula has two halves. The first half is your run rate for: total runs you scored divided by total overs you faced. The second half is your run rate against: total runs conceded divided by total overs you bowled. NRR is the first figure minus the second.",
          "The key word is total. You add up every run and every over across all the matches that count, and only then divide. This is where most homemade spreadsheets go wrong, because averaging each match's NRR gives a different answer from the correct aggregate method."
        ],
        steps: [
          "List every completed match for the team, with runs scored, overs faced, runs conceded and overs bowled.",
          "Replace overs faced with the full quota for any innings in which the team was bowled out. Do the same for overs bowled when the opposition was bowled out.",
          "Convert every overs figure into true decimals (balls divided by 6).",
          "Add up the four columns.",
          "Divide total runs scored by total overs faced, then total runs conceded by total overs bowled.",
          "Subtract the second figure from the first and round to three decimal places."
        ]
      },
      {
        heading: "Converting overs: the most common mistake",
        paragraphs: [
          "Cricket overs are not decimals. The figure 18.4 means 18 overs and 4 balls. Since an over has six balls, 4 balls is 4/6 of an over, or 0.667. So 18.4 overs is 18.667 overs in maths terms.",
          "If you type 18.4 straight into a calculator, you understate the overs faced and overstate the run rate. Across a tournament, these small errors can change who goes through. The table below gives the conversions you will use most often."
        ],
        table: {
          caption: "Cricket overs notation converted to true decimal overs",
          headers: ["Balls into the over", "Written as", "Decimal value"],
          rows: [
            ["1 ball", "x.1", "x.167"],
            ["2 balls", "x.2", "x.333"],
            ["3 balls", "x.3", "x.5"],
            ["4 balls", "x.4", "x.667"],
            ["5 balls", "x.5", "x.833"]
          ]
        },
        callout: {
          title: "Quick check",
          text: "A team scores 100 in 12.3 overs. Wrong method: 100 / 12.3 = 8.13 per over. Right method: 12.3 overs is 12.5 decimal overs, so 100 / 12.5 = 8.00 per over."
        }
      },
      {
        heading: "The all-out rule",
        paragraphs: [
          "When a team is bowled out before its overs are up, the calculation does not use the overs it actually batted. It uses the full quota for that innings. If a team is all out for 135 in 18.4 overs of a 20-over game, its overs faced for NRR purposes is 20, not 18.667.",
          "The logic is simple. Losing all ten wickets ends your innings, so you have used up all of your batting resources. Without this rule, a team could collapse quickly and still post a respectable scoring rate. The rule works in reverse too: if you bowl the opposition out, you are credited with bowling the full quota.",
          "In local cricket with fewer players, all out means whatever your league agreed, for example seven wickets in an eight-a-side game. The principle stays the same. Once a side has no batters left, count its full quota of overs."
        ]
      },
      {
        heading: "A full three-match worked example",
        paragraphs: [
          "Here is a realistic group stage for one team, the Riverside XI, in a 20-over tournament. They won two and lost one. Watch how the all-out rule and the overs conversion both change the answer.",
          "In match two, Riverside were bowled out for 135 in 18.4 overs, so they are credited with 20 overs faced. The opposition chased 139 in 17.2 overs, which converts to 17.333. In match three, Riverside chased 171 in 19.3 overs, which is 19.5 decimal overs."
        ],
        table: {
          caption: "Riverside XI group stage figures (overs as used in the NRR calculation)",
          headers: ["Match", "Runs scored", "Overs faced", "Runs conceded", "Overs bowled", "Result"],
          rows: [
            ["1", "162/7", "20", "148/9", "20", "Won by 14 runs"],
            ["2", "135 all out (18.4)", "20 (all out)", "139/4", "17.333 (17.2)", "Lost by 6 wickets"],
            ["3", "171/5", "19.5 (19.3)", "170/6", "20", "Won by 5 wickets"],
            ["Total", "468", "59.5", "457", "57.333", ""]
          ]
        },
        callout: {
          title: "Worked calculation",
          text: "Run rate for: 468 / 59.5 = 7.866. Run rate against: 457 / 57.333 = 7.971. NRR = 7.866 - 7.971 = -0.105. Even with two wins from three, Riverside have a slightly negative NRR because of the heavy defeat in match two. If the scorer had wrongly used 18.4 overs for the all-out innings, the NRR would have come out as +0.075, a completely different picture."
        }
      },
      {
        heading: "Why you must not average match NRRs",
        paragraphs: [
          "It is tempting to work out the NRR for each match and take the average. In the Riverside example, the three match NRRs are +0.700, -1.269 and +0.269. Their average is -0.100, which is close to the true figure of -0.105 here but not the same. In tournaments with very short chases or rain-reduced matches, the gap can be much bigger.",
          "The aggregate method weights each match by the overs actually played. A 10-over rain-reduced game should count for less than a full 20-over game, and only the aggregate method does that. Most official tournament regulations use the aggregate method, so use it in your league too."
        ]
      },
      {
        heading: "Using NRR to plan the final group game",
        paragraphs: [
          "Before the last round, work out what result you need. Suppose your rival is on the same points and has a higher NRR. You can test scenarios: if you bat first and win by 30 runs, what does your NRR become? If you chase, how many overs do you need to finish in?",
          "When chasing, the fewer overs you take, the higher your run rate for. When defending, the lower you restrict the opposition, the lower your run rate against. Bowling a side out also helps, because they are then charged with the full 20 overs.",
          "Doing these sums by hand in a pavilion is slow and error-prone. Cricket Score Counter keeps tournament points tables with net run rate updated from each scored match, which saves the arithmetic and avoids the 18.4 versus 18.667 trap. It still helps to know the method so you can explain the table to anyone who questions it."
        ],
        bullets: [
          "Check which matches count. Abandoned games with no result are normally left out of NRR.",
          "Agree in advance how rain-reduced matches are handled, usually by using the reduced quota.",
          "Keep the scoresheets. Overs and balls must be exact, so a missing ball changes the result."
        ]
      }
    ],
    faqs: [
      {
        question: "What counts as overs faced if a team is all out?",
        answer:
          "The full quota of overs for that innings. In a 20-over match, a team all out in 14.2 overs is treated as having faced 20 overs for net run rate. This applies to both the batting side's figures and the bowling side's overs bowled."
      },
      {
        question: "How do I convert 15.5 overs for net run rate?",
        answer:
          "Treat the number after the point as balls, not tenths. Five balls is 5/6 of an over, or 0.833. So 15.5 overs becomes 15.833 overs in the calculation."
      },
      {
        question: "Does a match with no result count towards NRR?",
        answer:
          "Usually not. In most tournament regulations, abandoned or no-result matches are left out of the net run rate calculation completely. Matches decided by a revised target in a shortened game normally count, using the overs actually allotted."
      },
      {
        question: "Can a team with more wins have a lower NRR?",
        answer:
          "Yes. NRR only measures scoring rates, not results. A team that wins four close matches and loses one heavily can have a lower NRR than a team that wins three big and loses two narrowly. That is why NRR is used as a tie-breaker, not as the main ranking."
      },
      {
        question: "How many decimal places should NRR show?",
        answer:
          "Three decimal places is the standard, for example +0.735 or -0.105. Keep full precision during the calculation and round only at the end, otherwise rounding errors can creep in when teams are very close."
      }
    ],
    related: [
      "chasing-a-target-required-run-rate",
      "shortened-match-targets",
      "super-over-and-tie-rules",
      "how-to-read-a-cricket-scorecard"
    ]
  },
  {
    slug: "chasing-a-target-required-run-rate",
    title: "Chasing a Target: Planning an Innings with Required Run Rate",
    metaDescription:
      "How to use required run rate to plan a run chase: calculating it correctly, breaking the target into phases, and when to attack or consolidate in local cricket.",
    keywords:
      "required run rate, run chase strategy, how to chase a target in cricket, RRR calculation, chasing tips T20, cricket run rate planning",
    category: "Strategy & Skills",
    datePublished: "2026-09-22",
    summary:
      "Required run rate tells a chasing side how many runs per over it needs from here to the end. Used well, it turns a vague target into a clear plan for each phase of the innings. This guide shows how to calculate it properly and how experienced club captains use it.",
    keyTakeaways: [
      "Required run rate = runs needed / overs remaining, with overs remaining in true decimals (balls left divided by 6).",
      "Thinking in runs per ball is often clearer late in a chase: 64 off 45 is about 1.42 runs per ball.",
      "Split the chase into phases with a target score at each checkpoint rather than chasing the whole total at once.",
      "Wickets in hand matter as much as the rate. A required rate of 9 with eight wickets left is very different from 9 with three left.",
      "Rotating the strike keeps the rate under control far more reliably than relying on boundaries."
    ],
    sections: [
      {
        heading: "The basic calculation",
        paragraphs: [
          "The target is always one more than the first innings total. If the side batting first makes 155, the chasing team needs 156 to win and 155 to tie. Write the target down and make sure both scorers agree on it before the first ball of the chase.",
          "Required run rate, often shortened to RRR, is runs still needed divided by overs still remaining. The overs remaining must be in true decimals. With 45 balls left, that is 45 / 6 = 7.5 overs, not 7.3 overs, which is how it would be written in cricket notation.",
          "The current run rate is runs scored divided by overs faced, again in true decimals. Comparing the two numbers tells you whether you are ahead of the chase or falling behind it."
        ],
        callout: {
          title: "Worked example",
          text: "Target 156 in 20 overs. After 12.3 overs the score is 92/3. Runs needed: 156 - 92 = 64. Balls left: 120 - 75 = 45, which is 7.5 overs. Required run rate: 64 / 7.5 = 8.53. Current run rate: 92 / 12.5 = 7.36. The chasing side needs to lift its scoring by just over one run an over, or 1.42 runs per ball."
        }
      },
      {
        heading: "Runs per ball: the clearer number late on",
        paragraphs: [
          "Once a chase gets into the last five or six overs, many experienced players stop thinking in runs per over and start thinking in runs and balls. Saying \"we need 64 off 45\" is easier to act on than \"we need 8.53 an over\". It also makes the arithmetic of a single over very clear.",
          "As a rough guide, anything around one run a ball can be chased with good running and the occasional boundary. Around 1.5 runs a ball needs a boundary most overs. Above 2 runs a ball, you are relying on sixes and on the bowlers making mistakes. The table below helps the batting side read the situation quickly."
        ],
        table: {
          caption: "Reading a chase by runs per ball (a guide for club cricket)",
          headers: ["Runs per ball needed", "Equivalent RRR", "What it usually takes"],
          rows: [
            ["Under 1.0", "Under 6.0", "Singles, twos and patience. Avoid risk."],
            ["1.0 to 1.3", "6.0 to 7.8", "Strike rotation plus one boundary every over or so."],
            ["1.3 to 1.7", "7.8 to 10.2", "A boundary most overs. Target the weaker bowler."],
            ["1.7 to 2.2", "10.2 to 13.2", "Two boundaries most overs. Calculated risks."],
            ["Over 2.2", "Over 13.2", "All-out attack. Expect wickets to fall."]
          ]
        }
      },
      {
        heading: "Break the chase into checkpoints",
        paragraphs: [
          "Chasing 156 feels big. Chasing 40 in the first six overs, then 50 in the next eight, then 66 in the last six feels manageable. Splitting the innings into phases gives your batters something concrete to aim for and a clear signal when they are falling behind.",
          "Set checkpoint scores before you bat, based on the pitch, the boundary size and the bowlers you are facing. Keep them realistic. In most local T20 games, the last five overs produce more runs than any other phase, so you do not need to be ahead of the overall rate at the halfway mark.",
          "Give each pair one simple message at the start of a phase: \"40 off the next 30 balls, no more than one wicket\". That is far easier to play to than a moving decimal on a scoreboard."
        ],
        steps: [
          "Write the target and the total balls available.",
          "Choose three or four phases, for example overs 1 to 6, 7 to 14 and 15 to 20.",
          "Set a target score and a maximum number of wickets lost for each phase.",
          "At every checkpoint, compare the actual score with the plan and adjust the next phase.",
          "Hold back a set hitter for the final phase if your batting order allows it."
        ]
      },
      {
        heading: "Wickets in hand change everything",
        paragraphs: [
          "A required rate means nothing without the wickets column next to it. Needing 9 an over with eight wickets in hand lets your batters swing freely, because a dismissal only brings in another capable player. Needing 9 an over with three wickets left and your tail coming in is a much harder ask.",
          "This is the most common mistake in local chases. The top order sees the rate rising, panics, and loses three wickets in two overs. Suddenly the rate is higher still and there are fewer people to chase it. Often the better choice is to accept a slightly higher rate for an over or two while a new batter settles.",
          "A useful rule of thumb: if you lose two wickets in quick succession, the next 12 balls are for rebuilding with singles and twos. Then reassess. Most club bowling attacks have a weaker over somewhere, and set batters are far better placed to cash in on it."
        ]
      },
      {
        heading: "Strike rotation: the quiet way to stay in the chase",
        paragraphs: [
          "Dot balls hurt a chase more than anything else. Every dot ball adds to the pressure because it pushes up the rate needed from the remaining balls. In the worked example above, if the next over is a maiden, the chasing side needs 64 off 39, and the required run rate jumps from 8.53 to 9.85.",
          "Good chasing pairs look for a single off almost every ball they cannot hit for four. They push into the gaps, run the first run hard, and call clearly. Two quick singles in an over are worth more than one big swing that misses three times.",
          "If your team struggles with this, practise running between the wickets in nets with a coach calling the score and balls left. It builds the habit of thinking about the rate without staring at the scoreboard."
        ]
      },
      {
        heading: "When to attack and when to wait",
        paragraphs: [
          "There is no single correct tempo. On a slow pitch with a big boundary, wickets in hand are worth more and a late charge is the usual plan. On a small ground with a quick outfield, keeping the rate close from the start is safer, because the side batting first will also have scored quickly.",
          "Look at the bowlers who are left. If the opposition's best two bowlers have three overs each remaining, you may decide to see them off and attack the others. If they have finished their spells, it is often the moment to accelerate, even if the rate is comfortable.",
          "Cricket Score Counter shows the current run rate and required run rate after every ball, so the batters can glance at the score between overs instead of trying to work it out in their heads. The planning and the judgment still come from the captain and the players."
        ],
        bullets: [
          "Attack the weakest bowler's overs, especially if he or she has only one or two left.",
          "Slow down briefly after a wicket, but not for more than an over or two.",
          "Keep an eye on fielding restrictions: the powerplay is the cheapest time to score boundaries.",
          "In the last three overs, know exactly what you need from each ball."
        ]
      }
    ],
    faqs: [
      {
        question: "How do I calculate required run rate with balls left?",
        answer:
          "Divide the balls left by 6 to get true decimal overs, then divide the runs needed by that figure. For example, 50 needed off 33 balls is 50 / 5.5 = 9.09 runs per over. Do not use the cricket notation 5.3, which would give a wrong answer."
      },
      {
        question: "What is a good required run rate to chase in local T20 cricket?",
        answer:
          "It depends on the pitch and ground, but most club sides can manage 7 to 8 an over with wickets in hand. Above 10 an over for more than five overs, you will need clean hitting and some help from the bowlers. Keep an eye on wickets as much as the rate."
      },
      {
        question: "Should we chase the rate from the start or wait for the last overs?",
        answer:
          "In most local games, staying within one or two runs an over of the target rate through the middle overs is wise, then accelerating at the end. Falling too far behind early means the last overs ask for near-impossible hitting. Losing wickets early is just as dangerous, so find a balance."
      },
      {
        question: "Why does one dot ball make such a difference to the required rate?",
        answer:
          "Because the runs needed stay the same while the balls left go down. Late in a chase, a single dot ball can lift the required rate by half a run an over or more. That is why rotating the strike matters so much in tight finishes."
      }
    ],
    related: [
      "net-run-rate-explained",
      "powerplay-strategy",
      "batting-tips-for-beginners",
      "shortened-match-targets"
    ]
  },  {
    slug: "shortened-match-targets",
    title: "Rain-Shortened Matches: Setting Fair Revised Targets",
    metaDescription:
      "Simple, fair ways to set revised targets when rain shortens a local cricket match, with worked examples, honest weaknesses, and how DLS works in principle.",
    keywords:
      "rain rule cricket, revised target cricket, shortened match target, average run rate method, most productive overs method, DLS for local cricket, par score",
    category: "Strategy & Skills",
    datePublished: "2026-09-23",
    summary:
      "When rain or bad light cuts a match short, someone has to decide what the chasing side now needs. Professional cricket uses the DLS method, but most local games need something simpler that everyone can check. This guide explains the main local methods, their weaknesses, and how to agree one before the first ball.",
    keyTakeaways: [
      "Agree the rain rule, the minimum overs for a result and the method for revised targets before the toss, not when the clouds arrive.",
      "DLS is built on resources: overs remaining and wickets in hand together. Official targets need the official tables or software, so do not try to estimate them by hand.",
      "The average run rate method is simple but ignores wickets and tends to favour the chasing side.",
      "The most productive overs method is easy to apply from the scoresheet but tends to favour the side that batted first.",
      "A pre-agreed compromise, such as the midpoint of the two methods, is often the fairest option for a club or school league."
    ],
    sections: [
      {
        heading: "Decide before the toss, not in the rain",
        paragraphs: [
          "The worst rain arguments happen when nobody agreed anything in advance. One captain wants a simple run rate target, the other wants to call it a no-result, and the umpires are left guessing. Ten minutes before the start is the time to settle it.",
          "Agree three things with both captains and the umpires present: the minimum number of overs each side must face for a result, the method for setting a revised target, and what happens if play cannot restart at all. Write them on the scoresheet. If you run a league, put them in the playing conditions so every match uses the same rules.",
          "For reference, men's T20 internationals need at least five overs per side for a result and men's ODIs need at least 20. For a local 20-over game, five overs a side is a sensible minimum. For shorter formats like eight or ten overs, many leagues use half the scheduled overs."
        ]
      },
      {
        heading: "How DLS thinks about the problem",
        paragraphs: [
          "The Duckworth-Lewis-Stern method, used in professional cricket, starts from one idea. A batting side has two resources: overs left to face and wickets left to lose. A team with 10 overs and 10 wickets left can score much more than a team with 10 overs and 2 wickets left. Any fair target has to account for both.",
          "When overs are lost, DLS works out what percentage of their combined resources each side had available, then scales the target up or down. That is why a DLS target can look strange at first. A side that lost overs early, with all wickets in hand, has lost a different amount of resource from a side that lost overs late with eight wickets down.",
          "The official percentages come from published tables and licensed software, and they are updated from time to time. Making up your own version of those figures gives you a target that looks official but is not. For local cricket, it is more honest to use one of the simpler methods below, accept its known weaknesses, and apply it consistently."
        ]
      },
      {
        heading: "Method 1: average run rate",
        paragraphs: [
          "This is the simplest method and the one most local teams know. Work out the first innings run rate, multiply it by the overs the chasing side will now get, round down, and add one. Everyone can check it on a phone calculator.",
          "Its big weakness is that it ignores wickets. A side chasing over 15 overs with all ten wickets has more resource per over than the side that batted first over 20 overs, because it can afford to attack. So this method usually makes the chase easier than it should be, especially when the reduction is large."
        ],
        callout: {
          title: "Worked example: average run rate",
          text: "Team A score 168/6 in 20 overs. Rain reduces Team B's innings to 15 overs before it starts. Team A's run rate is 168 / 20 = 8.4 per over. Par for 15 overs is 8.4 x 15 = 126. Team B's revised target is 127 in 15 overs."
        }
      },
      {
        heading: "Method 2: most productive overs",
        paragraphs: [
          "This method looks at the first innings over by over. If Team B now gets 15 overs, take the 15 highest-scoring overs from Team A's innings and add them up. That total is the par score, and the target is one more.",
          "The idea is that the side batting first would have scored at least that many in its best 15 overs. The weakness is the opposite of the run rate method. It removes only the quiet overs, so the chasing side ends up with a stiff target. It also needs an accurate over-by-over record, which is easy with a scoring app or a well-kept scorebook and difficult without one."
        ],
        table: {
          caption: "Team A's 168/6, runs per over",
          headers: ["Overs 1-5", "Overs 6-10", "Overs 11-15", "Overs 16-20"],
          rows: [
            ["6, 9, 11, 4, 8", "7, 5, 10, 6, 3", "7, 9, 12, 5, 8", "11, 6, 14, 12, 15"],
            ["Subtotal 38", "Subtotal 31", "Subtotal 41", "Subtotal 58"]
          ]
        },
        callout: {
          title: "Worked example: most productive overs",
          text: "Drop Team A's five lowest overs (3, 4, 5, 5 and 6). The remaining 15 overs add up to 145. Team B's revised target is 146 in 15 overs, which is 19 runs more than the average run rate method gives for the same situation."
        }
      },
      {
        heading: "Method 3: agree a compromise par table",
        paragraphs: [
          "Because the two simple methods err in opposite directions, many club and school leagues use a compromise. One clean option: take the par from each method, average them, round down, and add one. It is still easy to check, and the bias in each method partly cancels out.",
          "The table below shows the three methods side by side for the same first innings. Notice how the gap between the run rate and most productive overs targets grows as more overs are lost. That is exactly when a fair method matters most.",
          "Whatever you choose, it is a local agreement, not an official calculation. Say so on the scoresheet, apply it every time, and review it at the end of the season if it keeps producing lopsided results."
        ],
        table: {
          caption: "Revised targets for Team B after Team A's 168/6 in 20 overs",
          headers: ["Overs for Team B", "Average run rate target", "Most productive overs target", "Compromise target"],
          rows: [
            ["18", "152", "162", "157"],
            ["15", "127", "146", "136"],
            ["12", "101", "127", "114"],
            ["10", "85", "112", "98"]
          ]
        }
      },
      {
        heading: "When rain stops play during the chase",
        paragraphs: [
          "If the chasing side has faced the minimum overs and play cannot restart, you need a par score at the point of the stoppage. Compare the chasing side's score with the par. If it is ahead, it wins. If it is level, the match is tied. If it is behind, the side batting first wins.",
          "Using the average run rate method, the par is the first innings run rate multiplied by the overs the chasing side has faced. This is quick, but it gives no credit for wickets in hand, so a side that has played safely with eight wickets left is judged the same as one that has lost seven. If your league prefers, the compromise approach above can be applied at the stoppage point in the same way, using the most productive overs up to that number of overs."
        ],
        callout: {
          title: "Worked example: stoppage during the chase",
          text: "Team A made 168 in 20 overs, so the run rate is 8.4. Team B are 70/2 after 9 overs when the match is called off. Par after 9 overs is 8.4 x 9 = 75.6, rounded down to 75. Team B needed 76 to win and 75 to tie. On 70, they fall short and Team A win."
        }
      },
      {
        heading: "A checklist for organisers",
        paragraphs: [
          "Most rain problems are really paperwork problems. A short, written set of conditions stops arguments and helps the scorers apply the rule calmly. It also protects the umpires, who can point to something both captains agreed.",
          "Keep a ball-by-ball or over-by-over record of both innings. Cricket Score Counter records each delivery, so the run rate and the runs in each over are there if you need them for a revised target. Paper scorers should total every over as they go."
        ],
        steps: [
          "Agree the minimum overs per side for a result.",
          "Agree the revised target method and write it on the scoresheet.",
          "Agree how lost time converts into lost overs, for example one over for every four minutes lost.",
          "Keep accurate over-by-over totals for both innings.",
          "When play stops, record the exact score, wickets and balls bowled.",
          "Calculate the revised target or par, and have both captains check it before play resumes."
        ]
      }
    ],
    faqs: [
      {
        question: "Can we just use DLS in our local match?",
        answer:
          "Only if you have access to the official DLS tables or licensed software and someone who knows how to use them. Guessing at DLS percentages produces a target that looks scientific but is not. For most local games, a simpler agreed method is fairer because both sides can check it."
      },
      {
        question: "Which simple method is the fairest?",
        answer:
          "None is perfect. Average run rate tends to help the chasing side, while most productive overs tends to help the side that batted first. A compromise between the two, agreed before the match, usually gives the most balanced result for club cricket."
      },
      {
        question: "What happens if the first innings is shortened as well?",
        answer:
          "If both sides lose the same overs before either innings starts, simply play a shorter match with no target adjustment. If the first innings is cut short while in progress, the fairest local approach is to give the chasing side the same number of overs and the first innings total plus one as its target, unless your league rules say otherwise."
      },
      {
        question: "How many overs make a valid result in a 20-over game?",
        answer:
          "In men's T20 internationals, each side must face at least five overs for a result. Most local 20-over leagues use the same five-over minimum. For very short formats, agree a minimum, often half the scheduled overs, before the toss."
      },
      {
        question: "Do we round the par score up or down?",
        answer:
          "Round the par down to a whole number. The par is the score for a tie, and the revised target to win is one run more. So a par of 75.6 becomes 75 for a tie and 76 to win."
      }
    ],
    related: [
      "duckworth-lewis-stern-explained",
      "net-run-rate-explained",
      "chasing-a-target-required-run-rate",
      "how-to-organise-a-local-cricket-match"
    ]
  },
  {
    slug: "powerplay-strategy",
    title: "Powerplay Strategy for Batting and Bowling Sides",
    metaDescription:
      "Powerplay rules for T20 and ODI cricket, how to scale them for local formats, and practical batting, bowling and field-setting plans for the opening overs.",
    keywords:
      "powerplay cricket rules, powerplay strategy, T20 powerplay fielding restrictions, ODI powerplay rules, powerplay bowling plans, local cricket powerplay",
    category: "Strategy & Skills",
    datePublished: "2026-09-25",
    summary:
      "The powerplay is the period at the start of an innings when only a few fielders may stand outside the inner circle. It is the cheapest time to score boundaries and the riskiest time to bowl. This guide covers the official rules, sensible local versions, and how both sides should plan for it.",
    keyTakeaways: [
      "In men's T20Is the powerplay is overs 1 to 6, with a maximum of two fielders outside the 30-yard circle.",
      "Men's ODIs have three phases: overs 1 to 10 (two outside), 11 to 40 (four outside) and 41 to 50 (five outside).",
      "For local formats, a powerplay of about 30 percent of the overs, rounded, keeps the same balance as a T20.",
      "Batters should target the gaps over the infield, not every ball. Losing two early wickets wastes the powerplay.",
      "Bowlers need a stump-to-stump line and a fuller length in the powerplay, with fielders set to save singles as well as boundaries."
    ],
    sections: [
      {
        heading: "What the powerplay rules say",
        paragraphs: [
          "A powerplay is a block of overs with fielding restrictions. The fielding side may only have a limited number of fielders outside the inner circle, which in professional cricket is marked 30 yards from the middle stump at each end. With fewer fielders on the boundary, lofted shots over the infield are much safer, so scoring rates usually rise.",
          "The table below summarises the current men's international rules. Domestic leagues and franchise competitions sometimes vary them, so always check your competition's playing conditions."
        ],
        table: {
          caption: "Fielding restrictions in men's international cricket",
          headers: ["Format", "Overs", "Max fielders outside the circle"],
          rows: [
            ["T20I powerplay", "1 to 6", "2"],
            ["T20I after the powerplay", "7 to 20", "5"],
            ["ODI powerplay 1", "1 to 10", "2"],
            ["ODI powerplay 2", "11 to 40", "4"],
            ["ODI powerplay 3", "41 to 50", "5"]
          ]
        }
      },
      {
        heading: "Scaling the powerplay for local formats",
        paragraphs: [
          "Local matches are often 8, 10, 12 or 16 overs a side, and many grounds have no marked circle. You can still use a powerplay. A simple approach is to keep the T20 proportion, where the powerplay is 6 of 20 overs, or 30 percent, and round to the nearest whole over.",
          "On a ground without a circle, place cones or shoes in a rough ring. Scale its size to the ground. On a small school field, 20 to 25 metres from the stumps is often enough. Agree the number of fielders allowed outside it before the toss, and tell the umpires, who are responsible for checking it.",
          "These are suggestions, not rules. A box cricket league or a very short tapeball game might prefer one powerplay over or none. What matters is that both sides know the rule before play starts."
        ],
        table: {
          caption: "Suggested powerplay lengths for local matches",
          headers: ["Overs per side", "30 percent of overs", "Suggested powerplay", "Fielders outside the ring"],
          rows: [
            ["20", "6.0", "6 overs", "2"],
            ["16", "4.8", "5 overs", "2"],
            ["12", "3.6", "4 overs", "2"],
            ["10", "3.0", "3 overs", "2"],
            ["8", "2.4", "2 overs", "1 or 2"],
            ["6", "1.8", "2 overs", "1"]
          ]
        }
      },
      {
        heading: "Batting in the powerplay",
        paragraphs: [
          "The powerplay rewards batters who hit into space, not batters who hit hard. With only two fielders out, the ground over mid-off, mid-on, cover and midwicket is often empty. A firm, controlled shot over the inner ring is worth four runs with very little risk.",
          "The biggest powerplay mistake in club cricket is losing two or three wickets while chasing quick runs. A score of 40 for 0 after six overs is usually more valuable than 55 for 3, because the set openers can keep scoring and the middle order is protected. Plan for one batter to take the risks and the other to rotate the strike.",
          "Read the bowler and the field together. If the opening bowler is quick and accurate, use the pace and run the ball past the slips or behind square. If the bowler drifts onto the pads, the leg side is open. Short bowling with no deep fielder behind square is a gift."
        ],
        bullets: [
          "Agree a powerplay target score and a maximum number of wickets before the innings starts.",
          "Look for the two boundary fielders and hit away from them.",
          "Run hard for the first run. Fielders in the ring can be beaten by quick singles too.",
          "Avoid swinging across the line in the first over. Get a look at the bowling first."
        ]
      },
      {
        heading: "Bowling in the powerplay",
        paragraphs: [
          "Powerplay bowling is about denying width. Any ball outside off stump can be cut or driven over the infield. A tight line on or just outside off stump, pitched up enough to bring the stumps into play, makes the batter hit straight, which is where your fielders are.",
          "New-ball bowlers who move the ball should still attack. One early wicket changes the shape of the innings far more than a couple of saved runs. Keep a slip in for the first two or three overs if your bowler is swinging it and the batters are poking outside off.",
          "Avoid the short ball unless you have a plan and a fielder for it. With most fielders up, a short ball that is pulled or hooked has a good chance of going for four. Bowl your quickest and most accurate bowlers early, and save a reliable death bowler for later."
        ]
      },
      {
        heading: "Field settings with only two out",
        paragraphs: [
          "Choosing your two boundary fielders is the key decision. For a right-arm seamer bowling to a right-handed batter, a common powerplay field has a third man or fine leg back and one deep square or deep midwicket, depending on where the batter likes to hit.",
          "The fielders inside the ring should save the single, not just stop the ball. Point, cover, mid-off, mid-on and midwicket in a tight ring make it hard for batters to rotate the strike. That builds pressure, and pressure brings false shots."
        ],
        bullets: [
          "Off-stump line to a right-hander: slip, point, cover, mid-off, mid-on, midwicket, square leg in the ring; third man and fine leg back.",
          "Against a strong leg-side player: move one boundary fielder to deep midwicket and bring third man up.",
          "Spinner in the powerplay: long-on and deep midwicket back for a right-arm off-spinner, with a tight off-side ring.",
          "Change the field after each boundary if the batter has found a pattern."
        ]
      },
      {
        heading: "Measuring how well the powerplay went",
        paragraphs: [
          "Judge the powerplay by two numbers together: runs and wickets. A fast start with heavy losses can leave the innings short later, and a slow start with all wickets intact may still set up a big total. Write both down at the end of the powerplay and compare them with what you planned.",
          "Cricket Score Counter shows the run rate at every stage, so you can see your powerplay rate at a glance and compare it with the rest of the innings when you look back at the scorecard after the match."
        ],
        callout: {
          title: "Worked example",
          text: "In a 16-over match with a 5-over powerplay, the batting side reaches 48/1. That is 48 / 5 = 9.6 runs per over. If they score at 7.5 an over for the remaining 11 overs, they add 82.5 runs, for a projected total of about 130. The bowling side should note that 9.6 an over is well above what they would concede in the middle overs, so taking a wicket early is worth almost any cost in runs."
        }
      }
    ],
    faqs: [
      {
        question: "How many fielders are allowed outside the circle in a T20 powerplay?",
        answer:
          "In men's T20 internationals, a maximum of two fielders may be outside the 30-yard circle during the first six overs. After the powerplay, up to five may be outside. Check your competition's rules, as some leagues vary this."
      },
      {
        question: "What are the ODI powerplay rules?",
        answer:
          "Men's ODIs have three phases. Overs 1 to 10 allow a maximum of two fielders outside the circle, overs 11 to 40 allow four, and overs 41 to 50 allow five. These are fixed blocks, not phases that captains choose."
      },
      {
        question: "Do we need a powerplay in local cricket?",
        answer:
          "It is not required, but it helps. A short powerplay encourages attacking cricket early and stops the fielding side putting everyone on the boundary from the first ball. Agree the length and the number of fielders allowed outside the ring before the toss."
      },
      {
        question: "What happens if there are too many fielders outside the circle?",
        answer:
          "Under the Laws and standard playing conditions, the umpire calls and signals no-ball, and in many formats the next delivery is a free hit. In local cricket, agree whether you are applying the same penalty, and make sure the umpires know where the boundary of the ring is."
      },
      {
        question: "Should spinners bowl in the powerplay?",
        answer:
          "They can, and many professional sides now do. A spinner who bowls straight, varies pace and does not give width can be hard to hit over the ring. Avoid it if the spinner is inconsistent, because a short or wide ball is easily punished with fewer fielders out."
      }
    ],
    related: [
      "death-overs-bowling-tips",
      "chasing-a-target-required-run-rate",
      "fielding-positions-explained",
      "no-ball-and-free-hit-scoring"
    ]
  },
  {
    slug: "death-overs-bowling-tips",
    title: "Death Overs Bowling: Yorkers, Slower Balls and Fields",
    metaDescription:
      "Death overs bowling tips for club cricketers: yorkers, slower balls, wide yorkers, field settings and over-by-over plans, with a worked final-overs example.",
    keywords:
      "death overs bowling, how to bowl yorkers, slower ball variations, death bowling field settings, T20 bowling tips, last over bowling plan",
    category: "Strategy & Skills",
    datePublished: "2026-09-26",
    summary:
      "The last few overs of a limited-overs innings decide more matches than any other phase. Bowling well at the death is less about pace and more about accuracy, clear plans and fields that match them. This guide sets out the main deliveries, how to set a field for each, and how to practise them.",
    keyTakeaways: [
      "At the death, missing your length by a metre costs far more than at any other stage, so practise one stock death ball until it is reliable.",
      "Set the field for the ball you are going to bowl, and do not change the plan halfway through the over without changing the field.",
      "Every wide or no-ball in the last two overs gives away a run and an extra delivery, and a no-ball may also bring a free hit.",
      "A single conceded is a win when the batting side needs two runs a ball.",
      "Talk to the captain before each ball if the situation changes. A rushed plan leads to full tosses and wides."
    ],
    sections: [
      {
        heading: "Why the death overs are different",
        paragraphs: [
          "In the last four or five overs of a T20, or the last eight to ten of a 50-over game, the batting side stops valuing its wickets and starts swinging. Most fielders are out on the boundary, and set batters are seeing the ball well. A delivery that would be a dot ball in the tenth over can go for six in the nineteenth.",
          "That changes what a good over looks like. Early on you want wickets and dot balls. At the death, you want to deny boundaries. Singles are acceptable and often welcome, because the batting side usually needs more than one run a ball.",
          "The bowlers who do well at the death are rarely the quickest in the team. They are the ones who can land the ball in a small area under pressure, and who stay calm when the first ball of the over goes for four."
        ]
      },
      {
        heading: "The yorker: your stock death ball",
        paragraphs: [
          "A yorker lands at or just in front of the batter's toes, near the popping crease. It is hard to get under for a lofted shot and hard to hit with full power. When it is slightly off target, though, it becomes a full toss, which is the easiest ball in cricket to hit for six.",
          "Aim at the base of the stumps, not the batter's feet, and keep your head steady and eyes on the target through delivery. Many club bowlers find it helps to look at a spot just in front of the crease rather than the stumps themselves. Practise with a shoe or a cone at the crease and count how many of every six you hit.",
          "Do not bowl a yorker every ball. Good batters will step away or move across to make room. Mix it with one change of pace or length an over, so they cannot set themselves early."
        ]
      },
      {
        heading: "Slower balls and variations",
        paragraphs: [
          "A slower ball works by making the batter swing too early. The key is to keep the arm speed and the run-up the same, so the batter has no warning. If you slow your action down, a good batter will spot it and wait.",
          "There are several common grips. The knuckle ball is held on the knuckles of the first two fingers. The off-cutter and leg-cutter come from rolling the fingers down the side of the ball at release. The back-of-the-hand slower ball is released over the top of the fingers. Learn one well before adding another.",
          "Slower balls are best bowled full or back of a length into the pitch. A slow ball that is too short sits up to be pulled, and one that is too full becomes a slow full toss. Both are easy runs."
        ],
        table: {
          caption: "Death bowling options at a glance",
          headers: ["Delivery", "Best used when", "Main risk", "Field to match"],
          rows: [
            ["Yorker on the stumps", "Batter is set and hitting straight", "Becomes a full toss", "Long-on, long-off, deep midwicket, deep square"],
            ["Wide yorker outside off", "Batter is moving across or clearing the front leg", "Called wide if too far", "Deep point, deep cover, long-off, third man"],
            ["Slower ball, full", "Batter is looking to hit hard", "Slow full toss", "Long-on, long-off, deep midwicket"],
            ["Bouncer", "Batter is waiting for the full ball", "Pulled for six, or penalised if above head height", "Fine leg and deep square back"],
            ["Back-of-a-length cutter", "Pitch is slow or gripping", "Pulled if it sits up", "Deep midwicket, deep square, cow corner"]
          ]
        }
      },
      {
        heading: "The wide yorker and the bouncer",
        paragraphs: [
          "The wide yorker is bowled full and well outside off stump, close to the wide line. It is hard to reach and hard to hit square, so the batter has to drive along the ground towards fielders. It is excellent against batters who move across their stumps to whip the ball to leg. The risk is straying past the wide guideline, which gives away a run and a ball.",
          "The bouncer is a surprise weapon, not a stock ball. Used once in an over against a batter waiting on the front foot, it can bring a top edge or a dot ball. Know your competition's limits on short balls and above-head-height deliveries, and stay within them. In junior and many local matches, bouncers are restricted, so check before you use one."
        ]
      },
      {
        heading: "Setting a death field",
        paragraphs: [
          "In a T20 after the powerplay you may have five fielders outside the circle. Use them where the batter hits, not where the textbook says. If the batter has hit two sixes over midwicket, that is where a fielder goes, even if it leaves a gap elsewhere.",
          "Then bowl to the field. A field with long-on, long-off and deep midwicket says you are bowling straight and full. If you then bowl short and wide, the field is useless and the captain loses trust in the plan. Agree the plan, set the field, and commit to it."
        ],
        bullets: [
          "Straight yorker plan: long-on, long-off, deep midwicket, deep square leg, plus one of third man or deep point.",
          "Wide yorker plan: deep point, deep cover, long-off, third man, with fine leg up to save the single.",
          "Keep a fielder inside the ring at short fine leg or short third if the batter likes to ramp.",
          "Change the field between balls if the plan changes, and tell the umpire."
        ]
      },
      {
        heading: "Planning the last two overs",
        paragraphs: [
          "The final overs are where clear arithmetic helps the bowling side. Know exactly what the batting side needs, and set a ceiling for each over. If you can keep an over to eight or nine with one boundary allowed, you put the pressure on the last over.",
          "The biggest gift at the death is an extra. A wide or no-ball gives away a run and does not count as one of the six legal balls in the over, so the batting side gets an extra chance to hit. In most limited-overs formats a no-ball is also followed by a free hit, which the batter can swing at without fear of being bowled or caught."
        ],
        callout: {
          title: "Worked example: defending 22 off 12 balls",
          text: "The batting side needs 22 off the last 2 overs, a required rate of 11. The 19th over goes 1, 1, 4, 1, 1, 1 for 9 runs. That leaves 13 off 6 balls, a rate of 13 an over or just over 2 runs a ball. If the last over then starts with two wides, the batting side needs 11 off 6 balls, and the bowler still has all six legal deliveries to bowl. Two wides have turned a hard chase into a manageable one without the batter hitting a ball."
        }
      },
      {
        heading: "How to practise death bowling",
        paragraphs: [
          "Death bowling has to be practised under pressure, not just in a relaxed net. Put a target on the crease and set a score for the batter to chase off six balls. Count every wide and full toss. Keep a record over a few weeks, and you will see your accuracy improve.",
          "Keep the run-up and action the same as for your normal bowling. If you sprint in faster for the yorker, your rhythm breaks and accuracy drops. Short, controlled sessions of three or four overs are more useful than long ones where fatigue makes the action fall apart. Warm up properly, and keep total bowling loads sensible, especially for young bowlers."
        ],
        steps: [
          "Mark the yorker zone with a shoe or cone on the popping crease.",
          "Bowl six balls aiming at it and record how many land within a hand-span.",
          "Add a batter with a target, for example 12 off 6 balls.",
          "Rotate between yorker, wide yorker and one slower ball.",
          "Finish with one over where the captain calls the ball and field each time."
        ]
      }
    ],
    faqs: [
      {
        question: "How do I bowl a yorker more consistently?",
        answer:
          "Keep your head still and focus on a spot at the base of the stumps or just in front of the crease. Release the ball a fraction later than for a good length. Practise with a target in every session, and track the hit rate so you know which way you are missing."
      },
      {
        question: "Which slower ball is easiest to learn?",
        answer:
          "Many club bowlers start with the off-cutter or a split-finger grip, because the action barely changes. The knuckle ball takes longer to master but is hard to read. Whichever you choose, keep your arm speed the same as your stock ball."
      },
      {
        question: "Should I bowl bouncers at the death in local cricket?",
        answer:
          "Only if your competition allows them and the batter is waiting on the front foot. Use it as a surprise, not a stock ball. In junior cricket and many friendly formats, short-pitched bowling is restricted, so check before the match."
      },
      {
        question: "Is giving away a single at the death a good result?",
        answer:
          "Often, yes. If the batting side needs 13 off 6, a single leaves 12 off 5 and moves a set batter off strike. Saving boundaries is more important than saving singles in the last two overs."
      },
      {
        question: "Why do no-balls hurt so much at the end of an innings?",
        answer:
          "A no-ball gives the batting side at least one run, an extra delivery, and in most limited-overs formats a free hit on the next ball. When every ball counts, that is like gifting the batter a free swing. Check your front foot in practice so it does not creep over the crease when you are tired."
      }
    ],
    related: [
      "powerplay-strategy",
      "bowling-tips-for-beginners",
      "no-ball-and-free-hit-scoring",
      "how-to-score-wides"
    ]
  },
  {
    slug: "batting-tips-for-beginners",
    title: "Batting Tips for Beginners: Grip, Stance and Defence",
    metaDescription:
      "Batting tips for new cricketers: how to grip the bat, set a balanced stance, play forward and back defence, leave the ball and rotate the strike in matches.",
    keywords:
      "batting tips for beginners, how to hold a cricket bat, cricket batting stance, forward defence, how to rotate strike, cricket batting technique",
    category: "Strategy & Skills",
    datePublished: "2026-09-28",
    summary:
      "Good batting starts with a few simple basics done the same way every ball. This guide covers grip, stance, defence, leaving the ball and running between the wickets, with common faults and quick fixes from club nets.",
    keyTakeaways: [
      "Hold the bat with both hands close together near the top of the handle, with the V shapes of thumb and finger lined up.",
      "A balanced, side-on stance with the head still and eyes level is the platform for every shot.",
      "A solid forward and back defence lets you survive good balls and wait for the bad ones.",
      "Cutting out dot balls by rotating the strike often adds more runs than learning a big shot.",
      "Wear a helmet and proper protection whenever you face a hard ball."
    ],
    sections: [
      {
        heading: "The grip",
        paragraphs: [
          "Lay the bat face down on the ground, handle towards you. Pick it up as if you were picking up an axe, with both hands close together near the top of the handle. For a right-hander, the left hand is on top and the right hand just below it. Left-handers do the opposite.",
          "Look at the V shapes made by your thumb and first finger on each hand. They should point roughly between the outside edge of the bat and the middle of the back of the bat, and line up with each other. If the bottom hand is wrapped too far round, you will tend to close the bat face and hit across the line.",
          "Grip firmly with the top hand and lightly with the bottom hand. The top hand guides the bat; the bottom hand adds power. A tight bottom hand is the most common reason beginners edge the ball or spoon catches to the leg side."
        ]
      },
      {
        heading: "Stance and guard",
        paragraphs: [
          "Stand side-on with your feet roughly shoulder-width apart, either side of the popping crease. Knees slightly bent, weight evenly on the balls of both feet. Your front shoulder points down the pitch towards the bowler, and your head is level with your eyes looking straight at the bowler's hand.",
          "Rest the bat near your back toe. Ask the umpire for a guard, usually middle stump or middle-and-leg, and mark the crease so you stand in the same place every ball. A consistent guard helps you judge which balls are on the stumps and which you can leave.",
          "Most balance problems start with the head. If your head falls towards the off side as the bowler runs in, your weight follows. Keep it still and over your feet. Try this in front of a mirror until it feels natural."
        ]
      },
      {
        heading: "Forward and back defence",
        paragraphs: [
          "Defence is the shot you will play most often against good bowling, and it keeps you in long enough to score. Play forward to fuller balls and back to shorter ones. The decision depends on the length, so watch the ball from the bowler's hand.",
          "In both shots, the bat comes down straight with the face angled slightly downwards, and the ball is played close to the body under your eyes. Soft hands help. Let the bat give a little as the ball arrives so it drops at your feet rather than flying to a close fielder."
        ],
        steps: [
          "Forward defence: lead with your head and front shoulder towards the line of the ball.",
          "Step forward with your front foot alongside the line, bending the front knee.",
          "Bring the bat down straight, close to your front pad, with the face angled down.",
          "Back defence: step back and across towards off stump, keeping your body side-on.",
          "Play the ball under your eyes with a high top-hand elbow and soft bottom hand."
        ]
      },
      {
        heading: "Judging line and length, and leaving the ball",
        paragraphs: [
          "Not every ball needs a shot. A ball well outside off stump that is not going to hit the stumps can be left alone, with the bat lifted high out of the way. Leaving well wears out the bowler and removes the risk of edging to the keeper or slips.",
          "Learn where your off stump is. Use your guard mark and practise leaving in the nets: the bowler bowls six balls just outside off, and you leave any that would miss. Be careful with balls that might come back in. Leaving a ball that hits the stumps is the most painful way to get out."
        ]
      },
      {
        heading: "Rotating the strike",
        paragraphs: [
          "Beginners often think runs come from boundaries. In local cricket, matches are usually won by the side that faces fewer dot balls. Every single moves the score, gives your partner a go and stops the bowler settling into a rhythm.",
          "Look for gaps in the ring of fielders and push the ball into them with soft hands. Call loudly and clearly: \"yes\", \"no\" or \"wait\". The batter who can see the ball best makes the call, usually the striker for shots in front of the wicket and the non-striker for shots behind it. Back up a step or two at the non-striker's end as the bowler releases, but stay in your ground until the ball has been delivered.",
          "Cricket Score Counter keeps a full player scorecard, including balls faced, so after each game you can check how many dot balls you played and set yourself a target for the next one."
        ],
        callout: {
          title: "Worked example: the value of fewer dot balls",
          text: "A team faces 60 balls in a 10-over innings. With 30 dot balls and the other 30 averaging 1.5 runs, they score 45, a strike rate of 75. Cut the dots to 20 and score off the other 40 at a lower 1.3 runs each, and they score 52, a strike rate of 86.7. Fewer dots added 7 runs without a single extra boundary."
        }
      },
      {
        heading: "Common faults and quick fixes",
        paragraphs: [
          "Almost every beginner shows one or two of the faults below. Work on one at a time. Trying to fix everything at once usually makes batting feel stiff and awkward.",
          "A coach or a teammate watching from side-on and from behind the bowler's arm can spot most of these in a few balls. Filming a net session on a phone is just as useful."
        ],
        table: {
          caption: "Beginner batting faults and how to fix them",
          headers: ["Fault", "What usually happens", "Quick fix"],
          rows: [
            ["Head falls over to the off side", "Playing across the line, lbw", "Keep eyes level and head over the front foot as you step"],
            ["Bottom hand too tight", "Edges and leading edges to the leg side", "Grip with the bottom hand's thumb and two fingers in drills"],
            ["Feet too far apart", "Slow to move forward or back", "Feet just wider than shoulder-width, knees soft"],
            ["Bat comes down from gully", "Inside edges onto the stumps", "Pick the bat up towards off stump, then bring it down straight"],
            ["Playing at balls wide of off stump", "Caught by keeper or slips", "Leaving drill: six balls outside off, leave all of them"]
          ]
        }
      },
      {
        heading: "Safety and a simple practice routine",
        paragraphs: [
          "Wear a helmet with a face guard, pads, gloves and an abdominal guard every time you face a hard ball, including in nets. Make sure the helmet fits and meets a recognised safety standard. With a tennis ball or tape ball you can bat with less gear, but a hard ball always needs full protection.",
          "Short, regular practice beats long, rare sessions. Twenty minutes of focused work twice a week will improve a beginner faster than one long weekend net."
        ],
        bullets: [
          "Five minutes of shadow batting: stance, forward defence, back defence, leave.",
          "Ten minutes of throw-downs or bowling machine at a steady pace, focusing on one skill.",
          "Five minutes of running between the wickets with a partner, calling every run.",
          "Finish by writing down one thing that went well and one to work on next time."
        ]
      }
    ],
    faqs: [
      {
        question: "What size bat should a beginner use?",
        answer:
          "Choose a bat you can lift and swing comfortably with your top hand. A bat that is too heavy pulls the head off line and slows your shots. When standing in your stance, the handle should sit comfortably near your front thigh."
      },
      {
        question: "Should I take middle or leg-stump guard?",
        answer:
          "Most beginners start with middle or middle-and-leg. It gives a clear idea of where off stump is. Once you know your game, you can adjust, but change your guard only after trying it in the nets."
      },
      {
        question: "How do I stop getting bowled?",
        answer:
          "Most beginners are bowled playing across the line or leaving a ball that was hitting the stumps. Work on a straight bat in defence, keep your head still, and learn exactly where your off stump is by practising your leaves."
      },
      {
        question: "What does strike rate mean for a batter?",
        answer:
          "Strike rate is runs scored per 100 balls faced. A batter who makes 12 off 30 balls has a strike rate of 40. In short formats, a higher strike rate helps the team, but staying in is still the first job for a beginner."
      }
    ],
    related: [
      "bowling-tips-for-beginners",
      "chasing-a-target-required-run-rate",
      "cricket-equipment-guide",
      "strike-rotation-explained"
    ]
  },
  {
    slug: "bowling-tips-for-beginners",
    title: "Bowling Tips for Beginners: Run-Up, Action and Length",
    metaDescription:
      "Beginner bowling tips covering grip, a repeatable run-up, a legal and safe action, front-foot no-balls, and how to find a good line and length in matches.",
    keywords:
      "bowling tips for beginners, how to bowl in cricket, cricket bowling action, bowling run-up, line and length, no-ball front foot rule",
    category: "Strategy & Skills",
    datePublished: "2026-10-01",
    summary:
      "Good bowling comes from repeating the same run-up and action every ball, then aiming at a consistent line and length. This guide covers the grip, run-up, a legal and safe action, the no-ball rules and simple ways to measure your progress.",
    keyTakeaways: [
      "Start with a seam-up grip: first two fingers either side of the seam, thumb underneath, seam pointing towards the batter.",
      "Mark out a run-up you can repeat. Rhythm matters more than length of run.",
      "The bowling arm must not straighten by more than 15 degrees during delivery under ICC regulations. Throwing is illegal.",
      "Aim at the top of off stump with a length that makes the batter unsure whether to go forward or back.",
      "Track accuracy in practice: count how many balls land in a target zone, and how many wides and no-balls you bowl."
    ],
    sections: [
      {
        heading: "The basic seam grip",
        paragraphs: [
          "Hold the ball with your index and middle fingers either side of the seam, close together but not touching. The seam should point straight down the pitch, or slightly towards the slips. Rest the ball on the side of your thumb underneath, roughly in the middle of the seam.",
          "Keep the ball in your fingers, not deep in your palm. A little space between the ball and the palm lets the wrist work freely and helps the ball come out with backspin, keeping the seam upright. That upright seam is what makes the ball move off the pitch or in the air.",
          "If you want to bowl spin, the grip is different. Learn one style at a time, and stick with seam-up until you can land the ball consistently."
        ]
      },
      {
        heading: "Building a repeatable run-up",
        paragraphs: [
          "Your run-up should be just long enough to reach a comfortable, rhythmic speed at the crease. Beginners often run in too far and too fast, then lose balance at delivery. Most medium-pace beginners do well with eight to twelve strides.",
          "Mark it out properly. Stand at the bowling crease, turn round, and run away from the stumps at your bowling pace for the number of strides you want. Mark the spot, then run back in towards the crease. Adjust until your front foot lands just behind the popping crease every time, then measure the distance in foot lengths so you can repeat it.",
          "Accelerate smoothly, with your last few strides the quickest. A sudden jump or stutter near the crease is a sign the run-up is the wrong length."
        ],
        steps: [
          "Start at the crease and run back at bowling pace for about ten strides.",
          "Mark your starting point with a marker or a scratch on the ground.",
          "Run in and bowl five balls, watching where your front foot lands.",
          "Move the mark forward or back by the distance you are over or short.",
          "Measure the final run-up in foot lengths and write it down."
        ]
      },
      {
        heading: "A safe and legal action",
        paragraphs: [
          "Most coaches describe actions as side-on, front-on or mid-way. All three can be effective. What matters for safety is that your hips and shoulders line up with each other at back-foot contact. A mixed action, where the hips face one way and the shoulders twist another, puts extra stress on the lower back and is a known injury risk for young fast bowlers. If you are unsure, ask a qualified coach to watch you.",
          "The action must also be legal. Under ICC regulations, the bowling arm may not straighten by more than 15 degrees between the point where it reaches the horizontal and the moment the ball is released. In plain terms, you must bowl, not throw. A straight, relaxed arm that rotates over the shoulder is the safest way to stay legal.",
          "Finish with a full follow-through. Let your bowling arm swing across your body and keep moving towards the batter after release. Stopping suddenly at the crease jars the body and often drags the ball down short."
        ]
      },
      {
        heading: "Front foot, back foot and no-balls",
        paragraphs: [
          "For a fair delivery, some part of your front foot must land behind the popping crease, whether it is grounded or in the air. Landing with your whole foot over the line is a no-ball. Your back foot must land within the return crease and must not touch it.",
          "Front-foot no-balls usually come from a run-up that is too long or a stride that lengthens when you try to bowl faster. Fix the run-up first. If it still creeps, mark a spot a few centimetres behind the popping crease in practice and aim to land on it."
        ]
      },
      {
        heading: "Line and length",
        paragraphs: [
          "Line is where the ball travels across the pitch. Length is where it bounces. For most seam bowlers, the target line is on or just outside off stump, which makes the batter play and brings bowled, lbw and caught behind into play.",
          "A good length is one that leaves the batter unsure whether to go forward or back. Its exact distance from the batter depends on your pace and the pitch, so use your eyes. If batters are driving you comfortably on the front foot, you are too full. If they are rocking back and pulling or cutting, you are too short."
        ],
        table: {
          caption: "Reading your length from the batter's reaction",
          headers: ["Length", "What the batter does", "Usual result"],
          rows: [
            ["Yorker", "Digs it out at the crease", "Hard to score, but becomes a full toss if missed"],
            ["Full", "Drives on the front foot", "Chances of bowled or edges, but boundaries if overpitched"],
            ["Good length", "Hesitates between forward and back", "Dot balls, edges and lbw chances"],
            ["Short of a length", "Goes back and defends or pulls", "Fewer wickets, cut and pull for runs"],
            ["Short", "Pulls, hooks or ducks", "Boundaries on most club pitches"]
          ]
        }
      },
      {
        heading: "Measuring your progress",
        paragraphs: [
          "Accuracy is easy to measure and hard to argue with. Put a target zone on the pitch with cones or a towel, about a good length on an off-stump line, and count how many balls land in it. Do the same over several sessions and you will see real progress.",
          "In matches, look at your bowling figures and how many extras you gave. Cricket Score Counter records each bowler's overs, maidens, runs and wickets, and wides and no-balls are charged to the bowler, so you can compare one game with the next."
        ],
        callout: {
          title: "Worked example: practice and match numbers",
          text: "In a net session, a beginner bowls 36 balls and 24 land in the target zone, an accuracy of 24 / 36 = 67 percent. In the weekend match, the same bowler returns figures of 4-0-28-2: four overs, no maidens, 28 runs, two wickets. That is an economy rate of 28 / 4 = 7 runs per over. One over in that spell contained three wides, so the bowler delivered nine balls to complete it and gave away three runs without the batter hitting anything."
        }
      },
      {
        heading: "Workload, warm-ups and staying fit",
        paragraphs: [
          "Bowling is physically demanding, especially for teenagers whose bodies are still growing. Warm up properly before every session with light running and dynamic stretches, then bowl a few balls at half pace before going full out.",
          "Many national boards publish guidelines on spell lengths and balls per day for young fast bowlers. Follow them, even when you feel fine. Most bowling injuries come from doing too much too soon, not from one bad ball.",
          "Finally, strengthen your core and legs. Simple exercises like planks, lunges and squats help you stay balanced through the action and recover faster between spells."
        ],
        bullets: [
          "Warm up for ten minutes before bowling at full pace.",
          "Increase your bowling load gradually from week to week.",
          "Stop and tell a coach if you feel back pain while bowling.",
          "Rest at least one day between heavy bowling sessions."
        ]
      }
    ],
    faqs: [
      {
        question: "How long should my run-up be as a beginner?",
        answer:
          "Long enough to reach a smooth, balanced speed at the crease, usually eight to twelve strides for a medium-pace beginner. If you are tired after a few overs or keep bowling no-balls, shorten it. A shorter, rhythmic run-up nearly always improves accuracy."
      },
      {
        question: "What is the 15-degree rule in bowling?",
        answer:
          "Under ICC regulations, the bowling arm may not straighten by more than 15 degrees between reaching the horizontal and releasing the ball. This separates a legal delivery from a throw. A relaxed, straight arm is the simplest way to stay within the rule."
      },
      {
        question: "Is it a no-ball if my front foot is on the line?",
        answer:
          "It depends on whether any part of the foot is behind the line. Some part of your front foot, grounded or raised, must be behind the popping crease, which is the back edge of the crease marking. If your foot is on the line but no part of it is behind that back edge, it is a no-ball."
      },
      {
        question: "What line should a beginner bowl?",
        answer:
          "Aim at the top of off stump, or just outside it. That line forces the batter to play, brings bowled and lbw into play, and makes leg-side runs harder. Bowling at the pads or very wide gives away easy runs and wides."
      },
      {
        question: "How can I stop bowling wides?",
        answer:
          "Most wides come from losing balance at the crease or rushing the action. Shorten the run-up, keep your head still and looking at the target, and follow through towards the batter. Practise with a target zone and count wides in every session."
      }
    ],
    related: [
      "death-overs-bowling-tips",
      "batting-tips-for-beginners",
      "how-to-score-wides",
      "how-wickets-are-credited"
    ]
  },
];
