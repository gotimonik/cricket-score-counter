import { Article } from "../articleTypes";

export const scoringArticles: Article[] = [
  {
    slug: "how-to-score-wides",
    title: "How to Score a Wide: Runs, Dismissals and Local Rules",
    metaDescription:
      "Learn exactly how to score a wide in cricket: the penalty run, runs taken off a wide, wides to the boundary, stumpings off a wide and common local rules.",
    keywords:
      "how to score a wide, wide ball cricket, wide runs, 5 wides, stumped off a wide, leg side wide, cricket scoring extras",
    category: "Scoring",
    datePublished: "2026-09-20",
    summary:
      "A wide costs one penalty run, does not count as one of the six balls in the over, and every run that comes from it goes against the bowler. This guide shows how to record wides that are run, wides that reach the boundary, and wickets that fall off a wide.",
    keyTakeaways: [
      "A wide is 1 penalty run plus any runs the batters complete, and it is never a legal ball in the over.",
      "A wide that runs away to the boundary is 5 wides, not 4 byes and not 1 wide plus 4.",
      "All wide runs are debited to the bowler, but the wide is not a ball faced by the batter.",
      "A batter can be stumped, run out, hit wicket or out obstructing the field off a wide, but never bowled, caught or lbw.",
      "Leg-side wide rules in local cricket are playing conditions, not Laws, so agree them before the toss."
    ],
    sections: [
      {
        heading: "What a wide actually costs",
        paragraphs: [
          "Under Law 22 of the Laws of Cricket, a wide adds one penalty run to the batting side's total. That run is recorded as an extra, not as a run to the batter. The delivery also does not count as one of the six balls in the over, so the bowler has to bowl it again. If the score was 54/2 after 7.3 overs and the next ball is a wide, the score becomes 55/2 and the over count stays at 7.3.",
          "The wide is charged to the bowler and appears in the runs column of the bowling figures. The batter, however, gets nothing: no run and no ball faced. If a batter has 12 off 9 balls and the bowler sends one down the leg side, she is still on 12 off 9. Team total up, bowler's runs up, batter unchanged. Most scoring errors with wides come from forgetting one of those three."
        ]
      },
      {
        heading: "Runs taken off a wide, and wides to the boundary",
        paragraphs: [
          "If the keeper fumbles a wide and the batters run, every completed run is added as more wides. There is no such thing as byes off a wide. Two completed runs off a wide is recorded as 3 wides: the 1 penalty plus 2 run. The batters swap ends if they complete an odd number of runs, exactly as they would off the bat.",
          "If the wide beats everyone and reaches the boundary, the batting side gets the penalty run plus the boundary allowance of 4. That is 5 wides. Scorers new to the job often write this as 4 byes, or as 1 wide and a separate 4. Both are wrong. The full 5 goes in the wides column and against the bowler.",
          "A wide that clears the boundary without bouncing is still only 5 wides. The boundary six applies only when the ball has been struck by the bat, so a wild bouncer that sails over the keeper and over the rope is worth 4 plus the penalty."
        ],
        table: {
          caption: "How common wide outcomes are recorded",
          headers: ["What happens", "Extras recorded", "Legal ball?", "Batter's balls faced"],
          rows: [
            ["Wide, no runs taken", "1 wide", "No", "No change"],
            ["Wide, batters run 1", "2 wides", "No", "No change"],
            ["Wide, batters run 2", "3 wides", "No", "No change"],
            ["Wide reaches the boundary", "5 wides", "No", "No change"],
            ["Wide, batter stumped", "1 wide, wicket to bowler", "No", "No change"],
            ["Wide, run out attempting a run", "1 wide plus runs completed", "No", "No change"]
          ]
        },
        callout: {
          title: "Worked example",
          text: "The batting side is 87/3 after 11.4 overs. The bowler fires one down the leg side, the keeper dives and misses, and the ball runs to the fence. Record 5 wides. The score becomes 92/3 and the overs stay at 11.4. The bowler's figures go up by 5 runs, and the striker's runs and balls faced do not change. The next ball is still the fifth ball of the twelfth over."
        }
      },
      {
        heading: "When the umpire should call a wide",
        paragraphs: [
          "The Laws define a wide as a ball that passes so far from the striker that it is not reasonably within reach for a normal cricket stroke, judged both from where the batter is standing and from a normal guard position. If the batter moves across and brings the ball within reach, it is not a wide. If the ball touches the bat or the batter's body, it cannot be a wide either. A ball that passes over head height, or would have done had the batter stood upright, can also be called a wide.",
          "Professional limited-overs cricket adds playing conditions on top of the Laws. The best known is the strict leg-side rule: almost any ball that passes down the leg side of the batter without touching bat or pad is called wide. Many T20 competitions also mark guide lines on the off side. These are conditions of a competition, not part of Law 22, which is why a Test match umpire allows far more width than a T20 umpire.",
          "As a scorer, you do not decide what is a wide. You record what the umpire signals, which is both arms stretched out horizontally. In a friendly game without neutral umpires, agree before play who makes the call, normally the bowling side's umpire at the bowler's end, and stick with it."
        ]
      },
      {
        heading: "Wickets off a wide",
        paragraphs: [
          "Because the batter does not have to play at a wide, the dismissals that depend on hitting or missing the ball cannot happen. A batter cannot be bowled, caught or lbw off a wide. But a batter who steps out of the crease and is stumped off a wide is out, and the stumping is credited to the bowler. The same goes for hit wicket. Run out and obstructing the field are also possible, as they are off almost any delivery.",
          "When a wicket falls off a wide, the wide penalty still counts. A stumping off a wide is 1 wide and a wicket. If the batters were running and one is run out after completing a run, the score is 1 penalty plus the completed run, recorded as 2 wides, and the run in progress at the moment of the run out does not count.",
          "The over count is still unchanged. That catches people out at the end of an over: a batter stumped off a wide on what would have been the sixth ball means the bowler still has to bowl the sixth ball to the new batter."
        ],
        bullets: [
          "Possible off a wide: stumped, run out, hit wicket, obstructing the field.",
          "Not possible off a wide: bowled, caught, lbw.",
          "Stumped and hit wicket go to the bowler's wicket tally; run out does not."
        ]
      },
      {
        heading: "When a ball is both a wide and a no-ball",
        paragraphs: [
          "Sometimes a bowler oversteps and also sends the ball miles wide. The Laws are clear: if a delivery is both a no-ball and a wide, it is a no-ball. You record it as a no-ball, with the no-ball dismissal rules applying, so the batter can no longer be stumped off it. In limited-overs matches the next ball will usually be a free hit.",
          "The penalty is still one run, not two. A common mistake in local games is to give 2 runs because the ball broke two rules at once. The Laws do not stack the penalties for a single delivery."
        ]
      },
      {
        heading: "Local and gully cricket variations",
        paragraphs: [
          "In tennis-ball, box and gully cricket, wides are often handled differently from the Laws. These are common local variations, not official rules, and they only work if both sides agree before the toss. Writing them down, even as a line in a WhatsApp group, prevents most arguments.",
          "If your group uses a variation, apply it the same way every match so the scorebook stays consistent from week to week."
        ],
        bullets: [
          "Wide lines marked with chalk or tape on a concrete or matting pitch, so the call is less of a judgement.",
          "No penalty run for a wide, only a re-bowl.",
          "A penalty run but no re-bowl in the final over, to stop games dragging on.",
          "No leg-side wides at all in very narrow gullies."
        ]
      },
      {
        heading: "Mistakes to avoid when scoring wides on your phone",
        paragraphs: [
          "Most phone scorers tap too quickly. A wide comes down, the keeper fumbles, the batters run one, and the scorer taps 1 run off the bat out of habit. Now the batter has a run she did not score, a ball she did not face, and the over is one ball ahead. On Cricket Score Counter, use the wide button and add the runs taken to it, and if you tap the wrong thing, the undo button is quicker than trying to correct it three balls later.",
          "The second mistake is losing the over count. After any wide, glance at the ball count. If the screen shows the over moved on, something is wrong. A good habit is to say the ball number out loud with the umpire: \"that's still four gone\"."
        ],
        steps: [
          "Wait for the umpire's signal before tapping anything.",
          "Record the wide first, then add any runs the batters completed.",
          "If the ball reached the boundary, make sure the total for that delivery is 5 wides.",
          "Check the ball count has not moved on.",
          "At the end of the over, check the bowler's runs match what you saw."
        ]
      }
    ],
    faqs: [
      {
        question: "Is a wide counted as a ball faced by the batter?",
        answer:
          "No. A wide is not a ball faced, so the batter's balls-faced count and strike rate are not affected. This is different from a no-ball, which does count as a ball faced. Neither counts as one of the six legal balls in the over."
      },
      {
        question: "How many runs is a wide that goes for four?",
        answer:
          "Five. The batting side gets the 1 penalty run plus 4 for the boundary, all recorded as wides and all charged to the bowler. It should never be written as 4 byes."
      },
      {
        question: "Can a batter be caught off a wide?",
        answer:
          "In practice, no. If the ball touches the bat it cannot be called a wide in the first place, so a catch off the bat means the delivery was a fair ball. A batter can be stumped, run out, hit wicket or out obstructing the field off a wide, but not bowled, caught or lbw."
      },
      {
        question: "Why are leg-side wides stricter in T20 than in Test cricket?",
        answer:
          "The strict leg-side rule comes from limited-overs playing conditions, not from the Laws themselves. Competitions add it to stop bowlers bowling negatively down the leg side. In a local match, it only applies if the organisers have agreed to use it."
      }
    ],
    related: ["no-ball-and-free-hit-scoring", "byes-and-leg-byes-explained", "umpire-signals-explained", "how-to-read-a-cricket-scorecard"]
  },
  {
    slug: "no-ball-and-free-hit-scoring",
    title: "No-Balls and Free Hits: How to Score Them Correctly",
    metaDescription:
      "How to score a no-ball and a free hit: the penalty run, runs off the bat, byes off a no-ball, which dismissals are allowed and common local scoring errors.",
    keywords:
      "no ball scoring, free hit rules, runs off a no ball, no ball byes, can you be out on a no ball, free hit dismissals, cricket extras",
    category: "Scoring",
    datePublished: "2026-09-22",
    summary:
      "A no-ball gives the batting side one penalty run, does not count in the over, and still counts as a ball faced by the batter. Runs hit off it go to the batter, runs not hit off it become more no-ball extras, and only a handful of dismissals are possible.",
    keyTakeaways: [
      "A no-ball is 1 penalty run, recorded as a no-ball extra and charged to the bowler.",
      "Runs scored off the bat on a no-ball belong to the batter; a four off a no-ball is 1 no-ball plus 4 to the batter.",
      "Byes and leg-byes off a no-ball are recorded as no-ball extras under the current Laws.",
      "Off a no-ball a batter can only be out run out, obstructing the field or hit the ball twice.",
      "The free hit is a limited-overs playing condition, and it carries over if the free-hit ball is itself a wide or no-ball."
    ],
    sections: [
      {
        heading: "The basic no-ball entry",
        paragraphs: [
          "Law 21 covers no-balls. The most common reasons are the bowler's front foot landing with no part behind the popping crease, a full toss above waist height, a throw instead of a bowl, or too many fielders in certain areas. Whatever the reason, the scoring is identical. The batting side gets one penalty run, recorded as a no-ball extra, and the delivery does not count as one of the six balls in the over.",
          "Unlike a wide, a no-ball does count as a ball faced by the batter. That matters for strike rates. If a batter on 20 off 14 blocks a no-ball back to the bowler, she is now on 20 off 15, while the over count does not move. The bowler is charged with the penalty run.",
          "The signal is one arm held out horizontally. In club cricket the umpire will often call \"no ball\" loudly as the ball is bowled so the batter knows the dismissal rules have changed. Record it once the ball is dead, not when you first hear the call."
        ]
      },
      {
        heading: "Who gets the runs: bat, bye or leg-bye",
        paragraphs: [
          "Here is where scorers go wrong most often. If the batter hits a no-ball with the bat, every run scored from that shot, including a boundary, is credited to the batter, and the penalty run is added on top as a no-ball extra. A no-ball hit for six is 7 to the total: 6 to the batter, 1 no-ball. Both the 6 and the 1 are charged to the bowler, because runs off the bat always are.",
          "If the ball is not hit by the bat, the runs the batters take are not byes or leg-byes. Under the current Laws they are scored as additional no-ball extras. So a no-ball that beats the keeper and runs away for four is 5 no-ball extras. Older scorebooks and some apps show these as 1 no-ball plus 4 byes, which was the convention under earlier codes. Since the 2017 Code, all of it goes in the no-ball column, and all of it is debited to the bowler.",
          "The quick rule is: off the bat goes to the batter, anything else goes to no-balls."
        ],
        table: {
          caption: "Scoring common no-ball outcomes",
          headers: ["What happens", "Batter's runs", "No-ball extras", "Total added"],
          rows: [
            ["No-ball, dot ball", "0", "1", "1"],
            ["No-ball, batter hits 2", "2", "1", "3"],
            ["No-ball, batter hits four", "4", "1", "5"],
            ["No-ball, batter hits six", "6", "1", "7"],
            ["No-ball, batters run 1 bye", "0", "2", "2"],
            ["No-ball, ball runs to boundary off pad", "0", "5", "5"]
          ]
        },
        callout: {
          title: "Worked example",
          text: "Chasing 141, the batting side is 118/5 after 17.2 overs. The bowler oversteps and the batter on 31 off 22 swings it over midwicket for six. Record 1 no-ball and 6 to the batter. The score becomes 125/5, the batter moves to 37 off 23, the over is still 17.2, and the bowler's figures go up by 7. The next ball is a free hit. If that free hit is a wide, record it and the next ball is still a free hit."
        }
      },
      {
        heading: "Which dismissals are possible off a no-ball",
        paragraphs: [
          "Once a no-ball is called, most ways of getting out disappear. The batter cannot be bowled, caught, lbw, stumped or out hit wicket. The dismissals that remain are run out, obstructing the field, which now includes what used to be called handled the ball, and hit the ball twice.",
          "In practice the one you will see is run out. If the batters are running off a no-ball and one is run out, the penalty run still stands, plus any runs completed before the wicket. The run in progress does not count. So a no-ball where the batters complete one and are run out going for the second is 1 run to the batter if it was hit, plus 1 no-ball, plus a wicket."
        ],
        bullets: [
          "Out off a no-ball: run out, obstructing the field, hit the ball twice.",
          "Not out off a no-ball: bowled, caught, lbw, stumped, hit wicket.",
          "A run out off a no-ball is never credited to the bowler."
        ]
      },
      {
        heading: "How free hits work",
        paragraphs: [
          "A free hit is not in the Laws of Cricket. It is a playing condition used in most limited-overs competitions, including ICC one-day and T20 cricket. After a no-ball, the next delivery is a free hit. On that ball, the batter can only be dismissed in the same ways as off a no-ball: run out, obstructing the field or hit the ball twice.",
          "The free-hit ball is otherwise an ordinary delivery. If it is a fair ball it counts in the over, and runs scored off it go to the batter normally. If the free-hit ball is itself a wide or a no-ball, the free hit carries over to the next delivery. Fielders generally cannot change position for a free hit unless the striker has changed.",
          "One quirk: if the batter misses a free hit and it bowls him, the ball is not dead. The batters can run byes, and some do, because they cannot be bowled. The runs are byes, recorded in the normal way, because the free hit itself was a legal delivery."
        ]
      },
      {
        heading: "Common local variations",
        paragraphs: [
          "Local cricket changes no-ball rules more than almost anything else. These are common local variations rather than Laws, so agree them before the toss and make sure both captains know them.",
          "If your group uses a no-ball penalty of two runs, or no free hits, set that up the same way every time so season stats stay comparable."
        ],
        bullets: [
          "Free hits only after front-foot no-balls, not after high full tosses.",
          "No free hits at all in timed or declaration matches.",
          "A full toss above the waist called a no-ball only if it is fast, with slow full tosses allowed.",
          "In gully cricket, no penalty run for a no-ball, just a re-bowl.",
          "A two-run penalty for every no-ball in some tennis-ball tournaments, to punish overstepping on short run-ups."
        ]
      },
      {
        heading: "Scoring no-balls on your phone without mistakes",
        paragraphs: [
          "The pressure moment is a no-ball hit for four in a tight chase. Everyone is shouting, and the scorer needs to enter one event with two parts. On Cricket Score Counter, tap the no-ball button and add the runs off the bat to it, so the batter gets the four and the extras column gets the one. If you tap the wrong combination, use undo immediately rather than patching it later.",
          "The second check is the free hit. After every no-ball, tell the umpire and the batting side \"free hit\" if your format uses them. Phone scorers are often the first to notice that the umpire forgot."
        ],
        steps: [
          "Wait for the umpire's no-ball signal and for the ball to be dead.",
          "Ask yourself: did the ball come off the bat?",
          "If yes, record the no-ball with the runs to the batter.",
          "If no, record all the runs as no-ball extras.",
          "Confirm the ball count did not move and call the free hit if required."
        ]
      }
    ],
    faqs: [
      {
        question: "Is a four off a no-ball five runs?",
        answer:
          "Yes, the total goes up by five. Four of those runs are credited to the batter and one is a no-ball extra. All five count against the bowler."
      },
      {
        question: "Can you be caught off a no-ball?",
        answer:
          "No. A batter cannot be caught, bowled, lbw, stumped or out hit wicket off a no-ball. They can only be out run out, obstructing the field, or hit the ball twice."
      },
      {
        question: "Does a no-ball count as a ball faced?",
        answer:
          "Yes. A no-ball counts as a ball faced by the batter even though it does not count as one of the six legal balls in the over. A wide, by contrast, is not a ball faced."
      },
      {
        question: "Are byes off a no-ball recorded as byes?",
        answer:
          "Not under the current Laws. If the ball is not hit by the bat, any runs taken or boundary awarded are added as no-ball extras and charged to the bowler. Some older scorebooks show them as byes, which is now out of date."
      },
      {
        question: "Can a free hit be a wide?",
        answer:
          "Yes. If the free-hit delivery is a wide, record the wide as normal and the free hit carries over to the next ball. The same applies if the free-hit delivery is another no-ball."
      }
    ],
    related: ["how-to-score-wides", "byes-and-leg-byes-explained", "how-wickets-are-credited", "umpire-signals-explained"]
  },
  {
    slug: "byes-and-leg-byes-explained",
    title: "Byes vs Leg Byes: The Difference and How to Record Them",
    metaDescription:
      "Byes and leg byes explained for scorers: when each applies, when leg byes are not allowed, why neither counts against the bowler, with worked examples.",
    keywords:
      "byes vs leg byes, what is a leg bye, what is a bye in cricket, leg bye rule, byes scoring, cricket extras explained",
    category: "Scoring",
    datePublished: "2026-09-24",
    summary:
      "Byes are runs taken when the ball misses both bat and batter; leg byes are runs taken when it hits the batter's body. Both are extras, both count as legal balls, and neither is charged to the bowler, which is exactly why getting them right matters.",
    keyTakeaways: [
      "A bye is when the ball touches neither the bat nor the batter; a leg bye is when it hits the batter's body.",
      "A glove holding the bat counts as the bat, so a ball off the glove is runs to the batter, not leg byes.",
      "Leg byes are only allowed if the batter tried to play the ball with the bat or tried to get out of the way.",
      "Byes and leg byes are legal balls and balls faced, but they are not charged to the bowler.",
      "Off a wide or a no-ball there are no byes or leg byes; those runs become wides or no-ball extras."
    ],
    sections: [
      {
        heading: "Two kinds of extra that look the same from the boundary",
        paragraphs: [
          "From the scorer's table, a bye and a leg bye often look identical. The ball is bowled, the batter does not hit it, and the batters run. The difference is entirely about what the ball touched on the way through. Get it wrong and the scorecard still adds up, but the extras line and the bowler's figures will not match what actually happened.",
          "Byes and leg byes are covered by Law 23. They have three things in common. They are extras, not runs to the batter. They are fair deliveries, so they count as one of the six balls in the over and as a ball faced by the striker. And neither is charged to the bowler, because the bowler did not concede them through a bad delivery; the keeper or the batter's body did.",
          "That last point is the reason this matters. Wrongly recording 4 leg byes as 4 runs to the batter gives the batter four runs she did not score and adds four to the bowler's figures. Wrongly recording 4 runs off the glove as leg byes does the opposite."
        ]
      },
      {
        heading: "What counts as a bye",
        paragraphs: [
          "A bye is any run taken, or boundary awarded, from a fair delivery that does not touch the bat or the striker's body. The classic case is a ball that beats the bat and the keeper, then runs away towards fine leg. If the batters run two, record 2 byes. If it reaches the boundary, record 4 byes.",
          "Byes are signalled by the umpire raising an open hand above the head. In local cricket with a part-time keeper on a bouncy mat, byes can easily become the biggest single item in the extras line, so it is worth recording every one carefully.",
          "Remember that a keeper's fumble is not an overthrow. If the keeper misses the ball and it trickles to the rope, that is 4 byes, nothing more."
        ]
      },
      {
        heading: "What counts as a leg bye",
        paragraphs: [
          "A leg bye is a run taken when the ball hits the striker's body but not the bat. Despite the name, it does not have to be the leg. It can be the pad, the thigh guard, the hip, the helmet or the arm. The umpire signals a leg bye by touching a raised knee.",
          "There is one important detail about hands. A glove on a hand that is holding the bat counts as part of the bat. So if the ball flicks the glove of a hand on the handle and the batters run, those are runs to the batter, not leg byes, and a catch off that glove is out. If the hand is off the bat at the time, the ball hitting it counts as hitting the body, and leg byes are possible."
        ],
        table: {
          caption: "Bye, leg bye or runs to the batter?",
          headers: ["Ball touched", "Record as", "Charged to bowler?", "Ball faced?"],
          rows: [
            ["Nothing, beat bat and keeper", "Byes", "No", "Yes"],
            ["Pad or body, batter played a shot", "Leg byes", "No", "Yes"],
            ["Pad, batter ducked or evaded", "Leg byes", "No", "Yes"],
            ["Pad, no shot and no attempt to avoid", "No runs, dead ball", "No", "Yes"],
            ["Glove of hand holding the bat", "Runs to batter", "Yes", "Yes"],
            ["Hand off the bat, shot attempted", "Leg byes", "No", "Yes"]
          ]
        }
      },
      {
        heading: "When leg byes are not allowed",
        paragraphs: [
          "Law 23 says leg byes can only be scored if the batter either attempted to play the ball with the bat or tried to avoid being hit by it. A batter who simply pads the ball away with no shot, then sets off for a run, is not entitled to it. The umpire should call and signal dead ball as soon as one run is completed or the ball reaches the boundary. The run or boundary is not scored and the batters return to their original ends.",
          "This catches out local players who have been padding away spinners for years. It is worth explaining before the match if you know the opposition are not used to it. In many casual games nobody enforces it at all, which is a common local variation, but it is not what the Laws say.",
          "For the scorer, a disallowed leg bye is simply a dot ball. The ball counts in the over and as a ball faced, and nothing is added to the total."
        ],
        callout: {
          title: "Worked example",
          text: "After 9 overs the score is 63/2. The first ball of the tenth over strikes the batter on the pad as he tries to flick it, and the batters run two: record 2 leg byes, score 65/2 after 9.1 overs, bowler's figures unchanged. Next ball, the batter pads up with no shot and they scamper a single. The umpire calls dead ball: score stays 65/2, now 9.2 overs, the batters go back to their original ends and the same batter faces again."
        }
      },
      {
        heading: "Byes and leg byes off wides and no-balls",
        paragraphs: [
          "There are no byes off a wide. If the keeper misses a wide and the batters run, those runs are extra wides. So a wide that the batters run two off is 3 wides, all charged to the bowler.",
          "Since the 2017 Code, the same idea applies to no-balls. If the ball is not hit by the bat, runs taken off a no-ball, including any that would otherwise have been byes or leg byes, are recorded as no-ball extras and charged to the bowler. Some older scorebooks and apps still split them into 1 no-ball and some byes. If your league uses an older convention, be consistent, but know that the current Law treats them as no-balls."
        ]
      },
      {
        heading: "Common scoring mistakes and how to avoid them",
        paragraphs: [
          "The most common error is not watching the umpire. A ball that clips the pad and runs fine looks like it came off the bat from square leg. If the umpire does not signal, the runs go to the batter. If the umpire touches a raised knee, they are leg byes. When in doubt, ask the umpire at the end of the over and fix it then. Cricket Score Counter has separate buttons for byes and leg byes, and the undo button lets you correct the last ball if the signal comes late.",
          "The second error is the maiden over. A maiden is an over in which the bowler concedes no runs. Because byes and leg byes are not charged to the bowler, an over with four leg byes and no other runs is still a maiden. Many scorers forget this and quietly take maidens away from their bowlers."
        ],
        bullets: [
          "Never assume: watch for the bye or leg-bye signal before recording runs.",
          "Glove on the bat is the bat; glove off the bat is the body.",
          "Disallowed leg byes are dot balls, not extras.",
          "Byes and leg byes still count as balls faced by the striker.",
          "Overs with only byes or leg byes can still be maidens."
        ]
      }
    ],
    faqs: [
      {
        question: "Do leg byes count against the bowler?",
        answer:
          "No. Byes and leg byes are not charged to the bowler, so they do not affect the bowler's runs conceded or economy rate. They do still count as legal balls in the over."
      },
      {
        question: "Is a ball off the glove a leg bye?",
        answer:
          "Only if the hand was not holding the bat at the time. A glove on a hand holding the bat counts as the bat itself, so runs from it go to the batter and the batter can be caught off it."
      },
      {
        question: "Can a leg bye go for four?",
        answer:
          "Yes. If the ball deflects off the batter's body and reaches the boundary, and the batter was playing a shot or avoiding the ball, it is 4 leg byes. If neither applied, the umpire calls dead ball and nothing is scored."
      },
      {
        question: "Can you score leg byes off a no-ball?",
        answer:
          "Runs can be taken, but under the current Laws they are recorded as no-ball extras rather than leg byes. They are charged to the bowler along with the one-run no-ball penalty."
      },
      {
        question: "Why are leg byes allowed at all?",
        answer:
          "Because a batter playing a genuine shot who gets hit has done nothing wrong, and the ball is still live. The rule against leg byes with no shot exists to stop batters padding everything away and running freely."
      }
    ],
    related: ["how-to-score-wides", "no-ball-and-free-hit-scoring", "how-to-read-a-cricket-scorecard", "umpire-signals-explained"]
  },
  {
    slug: "how-to-record-a-run-out",
    title: "How to Record a Run Out: Runs, Batter Out and Who Faces",
    metaDescription:
      "Scoring a run out properly: which runs count, how to tell which batter is out, who faces the next ball, and run outs off wides, no-balls and the last ball.",
    keywords:
      "how to score a run out, run out runs completed, which batter is run out, who faces after run out, run out off a no ball, cricket scoring wickets",
    category: "Scoring",
    datePublished: "2026-09-26",
    summary:
      "A run out is the busiest moment a scorer faces: you have to decide which runs count, which batter is out, and where the new batter goes, all within a few seconds. The rules are logical once you know them, and this guide walks through each one with real numbers.",
    keyTakeaways: [
      "Runs completed before the run out count; the run in progress when the wicket is broken does not.",
      "The batter out is the one whose ground is at the end where the wicket was put down, which depends on whether they had crossed.",
      "A run out is never credited to the bowler; record the fielder or fielders involved instead.",
      "The new batter takes the end left vacant by the dismissed batter, unless the over has ended.",
      "Off a wide or no-ball, the one-run penalty still counts even if a batter is run out."
    ],
    sections: [
      {
        heading: "Three questions for every run out",
        paragraphs: [
          "When a fielder breaks the stumps and the umpire raises a finger, a scorer needs three answers before tapping anything. How many runs count? Which batter is out? Who faces the next ball? If you settle all three in that order, you will get almost every run out right.",
          "It helps to watch the batters rather than the ball once a run out looks likely. The ball tells you where the wicket was broken. The batters tell you everything else: whether they had crossed, how many runs they completed, and who ends up where.",
          "If you missed it, ask the umpire at the end of the over. It is far better to pause for twenty seconds than to send the wrong batter back to the pavilion in your records."
        ]
      },
      {
        heading: "Which runs count",
        paragraphs: [
          "Every run completed before the wicket was broken counts. The run the batters were attempting at the moment of the run out does not. If the striker drives to long-on, the batters complete one and the striker is run out turning for a second, the team gets 1 run, credited to the striker if the ball came off the bat.",
          "If the ball was not hit, the completed runs are extras of the right type: byes, leg byes, wides or no-balls. So a run out off a wide after one completed run adds 2 wides, being the penalty plus the run, and a wicket. Off a no-ball the penalty run stands in the same way.",
          "The ball counts in the over if it was a fair delivery. Run outs do not change that. A run out off the third ball of an over still leaves three balls to bowl."
        ],
        table: {
          caption: "Runs to record on a run out",
          headers: ["Situation", "Runs added", "Recorded as", "Legal ball?"],
          rows: [
            ["Hit, out going for the first run", "0", "Wicket only", "Yes"],
            ["Hit, 1 completed, out going for second", "1", "1 to batter", "Yes"],
            ["Missed by bat, 1 completed, then out", "1", "1 bye or leg bye", "Yes"],
            ["Wide, 1 completed, then out", "2", "2 wides", "No"],
            ["No-ball hit, 2 completed, then out", "3", "2 to batter, 1 no-ball", "No"],
            ["Non-striker run out before delivery", "0", "Wicket only", "No"]
          ]
        }
      },
      {
        heading: "Which batter is out",
        paragraphs: [
          "Each batter has a ground at one end. When both are in the middle of the pitch, the Laws give each end's ground to the batter nearer to it. That is why crossing matters for run outs. Before the batters cross, each is still nearer the end they started from. After they cross, each is nearer the end they are running towards.",
          "So if the wicket is broken at the striker's end, the batter out is whichever batter's ground that is. If they had not crossed, it is the batter who left that end. If they had crossed, it is the batter running towards it. This is regardless of who called for the run or who was the slower runner.",
          "There is one special case. If one batter has stayed in or returned to their ground and the other has run to join them, the batter who was there first keeps that ground. The other one is out if the wicket at the empty end is broken."
        ],
        callout: {
          title: "Worked example",
          text: "Score 102/4 after 14.2 overs. Sharma is on strike, Iyer at the non-striker's end. Sharma drives to deep midwicket. They complete one, so Sharma is now at the bowler's end. Going for a second, they cross, and the throw to the keeper breaks the stumps at the striker's end with Sharma short. Sharma is out, run out. Record 1 run to Sharma and the wicket: 103/5 after 14.3 overs. Iyer is at the bowler's end, so the new batter walks to the striker's end and faces the fourth ball."
        }
      },
      {
        heading: "Who faces the next ball",
        paragraphs: [
          "After a run out, the not-out batter stays at the end they reached, and the new batter takes the other end. In practice that means the new batter goes to the end where the wicket was broken. Whoever is at the striker's end faces the next ball.",
          "The exception is the last ball of the over. Ends change at the end of every over, so if a run out happens on the sixth legal ball, work out where the batters are, then swap for the new over. The batter at the bowler's end becomes the striker for the next bowler.",
          "Do not confuse this with the 2022 change for catches. Since October 2022, when a batter is caught, the new batter always comes to the striker's end, except at the end of an over, no matter whether the batters crossed. That change applies to caught dismissals only. Run outs still depend on where the batters are."
        ]
      },
      {
        heading: "Run outs off wides, no-balls and before the ball is bowled",
        paragraphs: [
          "Run out is one of the few dismissals possible off any delivery, including wides, no-balls and free hits. The penalty run stays in the score. Because the wide or no-ball is not a legal delivery, the over count does not move, so the same ball number is bowled again to the new batter.",
          "The non-striker can also be run out by the bowler before the ball is delivered, if they leave their ground too early. Since 2022 this sits in Law 38 as an ordinary run out. It is not a ball in the over and it is not credited to the bowler, even though the bowler did the work. Many local groups have a house rule requiring a warning first; that is a common local variation, not a Law."
        ]
      },
      {
        heading: "Mistakes to avoid",
        paragraphs: [
          "The two most frequent errors are crediting the bowler and counting the run in progress. Both inflate numbers that people care about. A bowler with three wickets, one of which was a run out, has two wickets in the official figures.",
          "On Cricket Score Counter, record the run out with the wicket button, making sure the dismissed batter and the completed runs are right. Take a breath before you confirm. If you get it wrong, use undo straight away so the strike and the batting card stay correct."
        ],
        bullets: [
          "Do not add the run in progress.",
          "Do not give the wicket to the bowler; note the fielder instead.",
          "Do not assume the striker is the one out.",
          "Check where the new batter goes before the next ball.",
          "On a wide or no-ball run out, keep the penalty run."
        ]
      }
    ],
    faqs: [
      {
        question: "Does the bowler get a wicket for a run out?",
        answer:
          "No. Run outs are credited to the fielding side but not to the bowler's figures. Scorecards usually show the fielder in brackets, for example run out (Khan), or the thrower and the player who broke the stumps."
      },
      {
        question: "If the batters crossed, does the new batter face?",
        answer:
          "Not necessarily. The new batter goes to the end left empty by the dismissed batter. If that is the striker's end, they face the next ball; if it is the bowler's end, the not-out batter faces."
      },
      {
        question: "Can a batter be run out off a no-ball or free hit?",
        answer:
          "Yes. Run out is one of the dismissals still possible off a no-ball and off a free hit. The one-run penalty is still added along with any runs completed before the wicket."
      },
      {
        question: "What happens if the run out is on the last ball of the over?",
        answer:
          "Work out the batters' positions as normal, then change ends for the new over. The batter standing at the bowler's end after the run out becomes the striker for the first ball of the next over."
      }
    ],
    related: ["strike-rotation-explained", "overthrows-in-cricket", "how-wickets-are-credited", "how-to-read-a-cricket-scorecard"]
  },
  {
    slug: "overthrows-in-cricket",
    title: "Overthrows in Cricket: How Boundary Overthrow Runs Count",
    metaDescription:
      "How overthrows are scored: extra runs from a wild throw, the boundary overthrow rule, why crossing at the instant of the throw matters, plus local rules.",
    keywords:
      "overthrows cricket, boundary overthrow rule, overthrow runs, law 19.8, overthrow for four, how many runs for overthrow, cricket scoring",
    category: "Scoring",
    datePublished: "2026-09-28",
    summary:
      "Overthrows are extra runs taken after a fielder's throw gets past everyone. When the ball stays inside the field they are just more runs, but when it reaches the boundary there is a specific formula, and the key moment is when the throw was released, not when the ball crossed the rope.",
    keyTakeaways: [
      "Overthrows that stay in the field are simply added to the runs the batters complete.",
      "Boundary overthrows are 4 plus completed runs plus the run in progress only if the batters had crossed when the throw was released.",
      "Overthrow runs go to the batter if the ball was hit, and otherwise to the relevant extra.",
      "A fumble straight from the shot that rolls to the rope is a plain boundary, not an overthrow.",
      "Many local games cap or ban overthrow runs; that is a house rule and must be agreed first."
    ],
    sections: [
      {
        heading: "What an overthrow is",
        paragraphs: [
          "An overthrow happens when a fielder throws the ball, usually at the stumps or to the keeper, and nobody stops it. The ball keeps travelling, and the batters are free to keep running. It is not a separate type of extra. The extra runs are simply added to whatever the delivery was already producing.",
          "That means the credit follows the original delivery. If the striker hit the ball, every overthrow run is hers. If it was a bye, the overthrows are more byes. If it was a wide, the overthrows are more wides and they are charged to the bowler. There is no overthrow column in a scorebook.",
          "Overthrows are dealt with in Law 19, which covers boundaries. Overthrows that stay inside the field need no special rule, because the batters simply keep running and you count completed runs. The interesting part is what happens when the throw reaches the boundary."
        ]
      },
      {
        heading: "Overthrows that stay in the field",
        paragraphs: [
          "Suppose the striker pushes to cover and the batters run one. The fielder shies at the stumps, misses, and nobody is backing up. The batters run two more before the ball is returned. That is 3 runs to the striker. The batters have run three times, so they have changed ends.",
          "Scorecards do not usually separate these runs from the rest. A batter credited with 3 off that ball has 3 runs whether they came from a well-placed push and two overthrows or a hard run three. For your purposes, count completed runs and you are done.",
          "Note that a deflection off the stumps after a throw is still live, and so is a throw that hits a running batter by accident. The batters can keep running. Only a deliberate obstruction by a batter changes that, and the umpire would deal with it as obstructing the field."
        ]
      },
      {
        heading: "Boundary overthrows: the formula",
        paragraphs: [
          "Law 19.8 says that when an overthrow, or any wilful act of a fielder, sends the ball to the boundary, the batting side scores the boundary allowance plus the runs already completed, plus the run in progress if the batters had already crossed at the instant of the throw. Any penalty runs, such as the wide or no-ball penalty, are added as well.",
          "The key phrase is \"at the instant of the throw\". It is not when the ball crosses the rope, and it is not when the throw passes the stumps. Picture the moment the ball leaves the fielder's hand. Had the batters passed each other on the current run? If yes, that run counts. If no, it does not.",
          "In practice the boundary allowance is almost always 4. It cannot be 6, because the six is only for a ball struck by the bat that clears the rope on the full."
        ],
        callout: {
          title: "Worked example",
          text: "The score is 156/6 after 18.3 overs. The striker on 22 drops the ball into the covers and they complete one. They set off for a second. The fielder throws at the keeper's end and the ball races past everyone to the boundary. If the batters had crossed on the second run when the ball left the fielder's hand, the striker gets 1 + 1 + 4 = 6 and the score is 162/6. If they had not crossed, the striker gets 1 + 4 = 5 and the score is 161/6. Either way it is 18.4 overs."
        },
        table: {
          caption: "Boundary overthrow outcomes",
          headers: ["Completed runs", "Crossed at the throw?", "Boundary", "Runs scored"],
          rows: [
            ["0", "No", "4", "4"],
            ["0", "Yes", "4", "5"],
            ["1", "No", "4", "5"],
            ["1", "Yes", "4", "6"],
            ["2", "Yes", "4", "7"]
          ]
        }
      },
      {
        heading: "The 2019 World Cup final",
        paragraphs: [
          "The most famous overthrow in cricket came in the 2019 men's World Cup final at Lord's. With England chasing, a throw from the deep deflected off Ben Stokes's bat as he dived for the crease and ran away to the boundary. The umpires awarded 6 runs. Replays later suggested the batters had not crossed on their second run at the instant of the throw, and several experts, including former umpire Simon Taufel, said 5 would have been the correct award.",
          "For local scorers the lesson is useful. Even top umpires under pressure can get the crossing wrong. You record what the umpire signals and awards, but knowing the formula means you can quietly check and raise it at the end of the over if something looks off."
        ]
      },
      {
        heading: "Not every boundary after a fumble is an overthrow",
        paragraphs: [
          "If the ball is hit to mid-on, the fielder misfields, and it rolls through his legs to the rope, that is not an overthrow. No throw was made. It is a boundary 4, and any runs the batters were completing are replaced by the boundary, unless they had already run more than four. Similarly, a keeper who fumbles a ball that runs to the boundary has given away 4 byes, not overthrows.",
          "A separate rule applies if the ball hits a fielder's helmet lying on the ground. The ball becomes dead and the batting side receives 5 penalty runs, plus any runs already completed. That is a penalty, not an overthrow."
        ]
      },
      {
        heading: "Local rules and scorer habits",
        paragraphs: [
          "In gully, box and tennis-ball cricket, overthrow rules vary a lot. These are common local variations, not Laws, so confirm them before the toss. In box cricket, where the ball can rebound off the netting, there is often a fixed rule about how many runs a rebound can produce.",
          "On Cricket Score Counter, overthrows are just runs. If the ball was hit, enter the total runs off the bat; if it was a bye, enter the total byes. There is no need to split out the overthrow part."
        ],
        bullets: [
          "No overthrow runs at all: the ball is dead once the throw passes the stumps.",
          "Boundary overthrows count only 4, ignoring completed runs.",
          "A maximum of one overthrow run per ball.",
          "Watch the batters at the instant of the throw if a boundary overthrow looks possible.",
          "Credit overthrow runs to the batter or the original extra, never to a separate column."
        ]
      }
    ],
    faqs: [
      {
        question: "Are overthrows counted as extras?",
        answer:
          "Only if the original delivery was an extra. If the batter hit the ball, overthrow runs are credited to the batter. If it was a bye, wide or no-ball, the overthrow runs are added to that type of extra."
      },
      {
        question: "How many runs is a single plus an overthrow for four?",
        answer:
          "Usually 5, being 1 completed run plus the 4 boundary. If the batters had also crossed on a second run at the instant the fielder released the throw, that run counts too, making 6."
      },
      {
        question: "Can overthrows be charged to the bowler?",
        answer:
          "Yes, when they come from a shot off the bat or from a wide or no-ball, because those runs are always charged to the bowler. Overthrows on byes or leg byes are not charged to the bowler."
      },
      {
        question: "Is a misfield that goes for four an overthrow?",
        answer:
          "No. An overthrow requires a throw or a deliberate act by a fielder. A misfield straight from the shot that rolls to the boundary is simply a boundary 4 to the batter."
      },
      {
        question: "What if there is an overthrow off a wide?",
        answer:
          "Every run is still a wide. If the batters complete one run off a wide and a throw then goes to the boundary, the total is the 1 penalty plus 1 completed run plus 4, so 6 wides, with the run in progress added if they had crossed at the throw. All of it is charged to the bowler."
      }
    ],
    related: ["how-to-record-a-run-out", "strike-rotation-explained", "dead-ball-and-short-runs", "box-cricket-rules"]
  },
  {
    slug: "strike-rotation-explained",
    title: "Who Faces Next? Strike Rotation After Runs, Extras and Wickets",
    metaDescription:
      "A scorer's guide to strike rotation: who is on strike after odd and even runs, overs, wides, no-balls, short runs and every kind of wicket, including catches.",
    keywords:
      "strike rotation cricket, who faces next ball, change of strike, new batter on strike after catch, strike after wide, cricket scoring rules",
    category: "Scoring",
    datePublished: "2026-09-30",
    summary:
      "Knowing who is on strike is the scorer's quiet responsibility. Get it wrong and runs end up with the wrong batter for the rest of the innings. Strike follows where the batters physically end up, with a short list of exceptions that every scorer should know.",
    keyTakeaways: [
      "Strike follows where the batters end up: an odd number of completed runs swaps them, an even number does not.",
      "Penalty runs for wides, no-balls and fielding offences never change ends on their own.",
      "Ends always change at the end of an over, so a single off the last ball keeps the same batter on strike.",
      "Since 2022 a new batter always comes in on strike after a catch, unless the catch ended the over.",
      "After a boundary the batters stay at their original ends, even if they had crossed."
    ],
    sections: [
      {
        heading: "The one principle behind it all",
        paragraphs: [
          "There is no separate rule for each situation. The striker for the next ball is simply whoever is standing at the end the bowler will be bowling to. Runs make batters change ends; overs make bowlers change ends. Everything else is about whether the batters move and whether the Laws send them back.",
          "So the quickest way to track strike is to watch the batters, not the ball. When the ball is dead, look at who is at the striker's end. On most deliveries that tells you the answer. The tricky cases are the ones where the Laws override what the batters physically did, and those are covered below.",
          "Scoring apps generally work out the strike from what you enter. That only works if what you enter is right, which is why understanding the logic still matters, especially for the handful of cases where the batters' positions and the runs scored do not line up."
        ]
      },
      {
        heading: "Runs, boundaries and the end of the over",
        paragraphs: [
          "Odd completed runs (1, 3, 5) swap the batters. Even completed runs (0, 2, 4 run) leave them where they were. This applies to runs off the bat, byes and leg byes alike.",
          "Boundaries are different. When the ball reaches the boundary, the batters go back to their original ends, even if they had crossed on a run. A boundary 4 or 6 therefore never changes the strike. The rare exception is when the batters had already run more than the boundary allowance before the ball reached the rope, in which case the higher figure is scored instead. On a local ground you might see that once a season.",
          "At the end of every over the bowling switches to the other end, so whoever finished at the non-striker's end faces the first ball of the next over. That is why batters try to take a single off the last ball. They run to the other end, then the over changes, and they are on strike again."
        ],
        callout: {
          title: "Worked example",
          text: "Score 74/2 after 9.5 overs. Patel is on strike, Das at the non-striker's end. Patel works the sixth ball to square leg for a single: 75/2 after 10 overs. Patel is now at the bowler's end. The next over is bowled from the other end, so Patel faces the first ball of the eleventh over. If Patel had taken two instead, he would be back at the striker's end, and Das would face the next over."
        }
      },
      {
        heading: "Wides, no-balls and penalty runs",
        paragraphs: [
          "The one-run penalty for a wide or a no-ball does not move anybody. Only runs the batters actually complete do. A wide with no running keeps the same striker. A wide where the batters run one is recorded as 2 wides, and the batters have swapped ends. A wide that goes to the boundary is 5 wides and the batters stay at their original ends.",
          "No-balls work the same way. A no-ball hit for a single is 2 runs in total, and the batters have crossed. A no-ball hit for four is 5 runs, and they have not. Because neither a wide nor a no-ball counts in the over, the over cannot end on one of them.",
          "Five-run penalties, such as when the ball hits a fielder's helmet on the ground, also do not change ends. Only completed runs count for strike."
        ],
        table: {
          caption: "Does the strike change?",
          headers: ["What happened", "Runs recorded", "Strike changes?"],
          rows: [
            ["1 run off the bat", "1", "Yes"],
            ["2 leg byes", "2", "No"],
            ["Boundary four", "4", "No"],
            ["Wide, no runs taken", "1 wide", "No"],
            ["Wide, batters run 1", "2 wides", "Yes"],
            ["No-ball hit for 1", "1 + 1 no-ball", "Yes"],
            ["Single off the last ball of the over", "1", "No (same batter faces next over)"],
            ["Two runs, one called short", "1", "No"]
          ]
        }
      },
      {
        heading: "Short runs and disallowed runs",
        paragraphs: [
          "When an umpire calls one short, it means a batter did not ground the bat beyond the crease when turning. That run is not scored, but the batters stay where they are. So if they ran two and one was short, the score goes up by 1 but the batters have run twice and are back at their original ends. The strike does not change, even though only an odd number of runs was scored. This is the case scorers most often get wrong.",
          "Deliberate short running is treated far more harshly. The umpire disallows all runs, returns the batters to their original ends, and awards 5 penalty runs to the fielding side.",
          "When leg byes are not allowed because the batter neither played a shot nor tried to avoid the ball, the umpire calls dead ball and the batters also return to their original ends."
        ]
      },
      {
        heading: "Strike after a wicket",
        paragraphs: [
          "For bowled, lbw, stumped and hit wicket, the striker is out and the batters have not run, so the new batter takes the striker's end and faces the next ball. If the wicket fell on the last ball of the over, the not-out batter faces the next over instead.",
          "Catches changed in October 2022. Before then, if the batters crossed while the catch was being taken, the not-out batter would face. Now the new batter always comes in at the striker's end, whether or not the batters crossed. The only exception is when the catch is taken off the last ball of the over, when the not-out batter faces the new over from the other end.",
          "Run outs still depend on where the batters are. The new batter takes the end vacated by the dismissed batter, and whoever is at the striker's end faces."
        ],
        bullets: [
          "Bowled, lbw, stumped, hit wicket: new batter faces unless the over has ended.",
          "Caught: new batter faces unless the over has ended, crossing no longer matters.",
          "Run out: new batter goes to the dismissed batter's end; check who is at the striker's end."
        ]
      },
      {
        heading: "Local variations and checking your work",
        paragraphs: [
          "Some local formats change these rules, and they are house rules rather than Laws. Many friendly sides still play the old pre-2022 crossing rule for catches out of habit. In gully cricket, \"last man batting\" lets the final batter continue alone, so there is no rotation at all; the same batter faces every ball. Agree these before the match.",
          "A simple check helps: before each ball, glance at the striker on your screen and at the batter taking guard. If they do not match after a short run or a tricky wicket, use the undo button on Cricket Score Counter and re-enter the ball, rather than letting the wrong batter collect runs for the next ten deliveries."
        ]
      }
    ],
    faqs: [
      {
        question: "Who faces after a wide when the batters run?",
        answer:
          "It depends on the runs completed, not the penalty. If they complete one run, they have swapped ends and the other batter faces. If they complete two, the same batter faces again."
      },
      {
        question: "Does the new batter face after a catch?",
        answer:
          "Yes, under the Laws since October 2022, unless the catch was taken off the last ball of the over. Whether the batters crossed while the ball was in the air no longer matters."
      },
      {
        question: "Why does a single off the last ball keep the batter on strike?",
        answer:
          "The single takes the batter to the bowler's end. The next over is bowled from the other end, so that batter is now at the striker's end. Two runs off the last ball would hand the strike to the partner."
      },
      {
        question: "Do the batters change ends after a boundary if they had crossed?",
        answer:
          "No. When a boundary is scored the batters return to their original ends. The striker who hit the four or six stays on strike for the next ball, unless it was the last ball of the over."
      },
      {
        question: "What if one run is short?",
        answer:
          "That run is not scored but the batters stay where they ended up. If they ran two with one short, 1 run is scored and the striker stays on strike."
      }
    ],
    related: ["how-to-record-a-run-out", "how-to-score-wides", "dead-ball-and-short-runs", "gully-cricket-rules"]
  },
  {
    slug: "how-to-read-a-cricket-scorecard",
    title: "How to Read a Cricket Scorecard: Batting, Bowling and FoW",
    metaDescription:
      "Learn to read any cricket scorecard: batting columns, dismissal notation, the extras line, fall of wickets and bowling figures like 4-0-28-2, with an example.",
    keywords:
      "how to read a cricket scorecard, bowling figures explained, 4-0-28-2 meaning, fall of wickets, extras line, strike rate, economy rate, overs 3.4",
    category: "Scoring",
    datePublished: "2026-10-02",
    summary:
      "A cricket scorecard packs a whole innings into a few lines of numbers. Once you know what each column means and how the parts check against each other, you can read any card at a glance and spot scoring mistakes in your own matches.",
    keyTakeaways: [
      "Bowling figures are written overs-maidens-runs-wickets, so 4-0-28-2 means 4 overs, no maidens, 28 runs and 2 wickets.",
      "Overs are written in balls, not decimals: 3.4 overs means 3 overs and 4 balls, or 22 balls.",
      "Batters' runs plus extras must equal the team total.",
      "Bowlers' runs add up to the total minus byes, leg byes and penalty runs.",
      "Run outs appear on the batting card but never in a bowler's wicket column."
    ],
    sections: [
      {
        heading: "The four parts of a scorecard",
        paragraphs: [
          "Every innings on a scorecard has the same building blocks, whether it comes from a Test match or your Sunday game. There is the batting card, listing each batter and how they got out. Under it are the extras line and the total. Then comes the fall of wickets, showing the score when each wicket fell. Finally there is the bowling card, with one line per bowler.",
          "These parts are not independent. They check each other. A scorer who knows how they fit together can find a mistake in seconds, which is far more useful than just being able to read the numbers.",
          "The example used throughout this guide is a 20-over local match in which the batting side made 168/7."
        ]
      },
      {
        heading: "The batting card",
        paragraphs: [
          "Each row shows a batter's name, how they were out, runs (R), balls faced (B), fours, sixes and strike rate (SR). Strike rate is runs per 100 balls, so a batter with 42 off 30 has a strike rate of 140.0. Balls faced include no-balls but not wides, which is why a batter's ball count can be lower than you expect if the bowling was wayward.",
          "The dismissal column uses short notation. \"b\" means bowled by, and the bowler named after \"b\" gets the wicket. \"c\" names the catcher. A dagger or the letters wk often mark the wicketkeeper. Run outs name the fielder in brackets and give no bowler at all, because the bowler is not credited.",
          "Batters who did not bat are listed underneath, often under \"Did not bat\" or \"Yet to bat\". A batter shown as \"not out\" was still batting when the innings ended, and their score is often marked with an asterisk, such as 54*."
        ],
        table: {
          caption: "Common dismissal notation",
          headers: ["Written as", "Meaning", "Bowler credited?"],
          rows: [
            ["b Patel", "Bowled by Patel", "Yes"],
            ["c Khan b Patel", "Caught by Khan off Patel", "Yes"],
            ["c & b Patel", "Caught by Patel off his own bowling", "Yes"],
            ["lbw b Patel", "Leg before wicket, bowled by Patel", "Yes"],
            ["st Rao b Singh", "Stumped by keeper Rao off Singh", "Yes"],
            ["hit wicket b Singh", "Hit wicket off Singh", "Yes"],
            ["run out (Khan)", "Run out, Khan made the throw or broke the stumps", "No"],
            ["not out", "Still batting at the end", "Not applicable"]
          ]
        }
      },
      {
        heading: "The extras line and the total",
        paragraphs: [
          "Below the batters comes the extras line, usually written like this: Extras (b 2, lb 4, w 6, nb 1) 13. That means 2 byes, 4 leg byes, 6 wides and 1 no-ball, for 13 extras in all. Some cards also show penalty runs as p.",
          "Then comes the total, written as runs and wickets with the overs used: 168/7 (20 overs). In Australia the order is sometimes reversed, as 7/168, so check the context. If a side is bowled out, the total shows just the runs, often with \"all out\".",
          "The first check is the simplest. Add up every batter's runs and add the extras. It must equal the total. If the batters in our example scored 155 between them, 155 plus 13 extras gives 168. If it does not match, a run has been given to the wrong place."
        ]
      },
      {
        heading: "Fall of wickets",
        paragraphs: [
          "The fall of wickets line, often shortened to FoW, lists the team score each time a wicket fell. An entry such as 1-12 (Rahul, 2.3 ov) means the first wicket fell with the score on 12, Rahul was the batter out, and it happened on the third ball of the third over.",
          "FoW tells the story of an innings better than any other line. A sequence like 1-12, 2-15, 3-19 shows a collapse. A gap such as 4-48, 5-131 shows an 83-run partnership for the fifth wicket. You can work out any partnership by subtracting one FoW score from the next."
        ]
      },
      {
        heading: "Bowling figures: what 4-0-28-2 means",
        paragraphs: [
          "Bowling figures are written in a fixed order: overs, maidens, runs, wickets. So 4-0-28-2 means the bowler sent down 4 overs, bowled no maidens, conceded 28 runs and took 2 wickets. Most cards add the economy rate, which is runs per over, and columns for wides and no-balls.",
          "Overs use a special notation. 3.4 overs means 3 complete overs and 4 balls, not three and four-tenths. To get economy for 26 runs off 3.4 overs, convert to balls first: 22 balls is 3.67 overs, and 26 divided by 3.67 is about 7.09 per over. Dividing 26 by 3.4 gives 7.65, which is wrong.",
          "A maiden is an over in which the bowler concedes no runs. Byes and leg byes do not count against the bowler, so an over with four leg byes can still be a maiden. Wides and no-balls do count, so an over with a single wide is not."
        ],
        callout: {
          title: "Worked example: checking the bowling card",
          text: "Total 168/7 with extras of b 2, lb 4, w 6, nb 1. The bowlers should have conceded 168 minus 2 byes minus 4 leg byes, which is 162. The figures are Patel 4-0-28-2, Singh 4-0-35-1, Mehta 4-1-22-2, Khan 4-0-41-0 and Das 4-0-36-1. Their runs add up to 28 + 35 + 22 + 41 + 36 = 162, so the card balances. Their wickets add up to 6, and the seventh wicket is the run out on the batting card."
        }
      },
      {
        heading: "Spotting mistakes in your own scorecards",
        paragraphs: [
          "Once a match is over, run the three checks: batters plus extras equals the total; bowlers' runs equal the total minus byes, leg byes and penalty runs; bowlers' wickets plus run outs and other non-bowler dismissals equal the wickets fallen. If all three match, your card is almost certainly right.",
          "When they do not, the cause is usually one of a handful of errors. Cricket Score Counter keeps finished games in match history, so you can open the card the next day, run these checks and see exactly which over the problem is in."
        ],
        bullets: [
          "Byes or leg byes entered as runs off the bat, which inflates both a batter and a bowler.",
          "A run out credited to the bowler.",
          "Wides added to the batter's balls faced.",
          "Economy calculated by dividing by the decimal overs figure.",
          "Maidens removed because of byes or leg byes."
        ]
      }
    ],
    faqs: [
      {
        question: "What does 10-2-45-3 mean in bowling figures?",
        answer:
          "It means 10 overs bowled, 2 maidens, 45 runs conceded and 3 wickets taken. The economy rate is 4.5 runs per over."
      },
      {
        question: "Why do the bowlers' runs not add up to the team total?",
        answer:
          "Because byes, leg byes and penalty runs are not charged to any bowler. Subtract those from the total and the bowlers' runs should match exactly. Wides and no-balls are charged to the bowler, so they are already included."
      },
      {
        question: "What does an asterisk next to a score mean?",
        answer:
          "It means the batter was not out. On some cards an asterisk next to a name in the team list marks the captain instead, so check the context."
      },
      {
        question: "Is 19.6 overs the same as 20 overs?",
        answer:
          "It should never appear. After the sixth legal ball the over is complete and is written as 20. If you see 19.6 on a card, it is a recording error or a display quirk."
      },
      {
        question: "Does a run out count as a wicket for the bowler?",
        answer:
          "No. A run out is a wicket for the team but not for any bowler. That is why the bowlers' wicket column often adds up to fewer than the wickets that fell."
      }
    ],
    related: ["how-wickets-are-credited", "byes-and-leg-byes-explained", "net-run-rate-explained", "how-to-score-wides"]
  }
];
