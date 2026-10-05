import React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { DeleteOutlineRounded } from "@mui/icons-material";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import MetaHelmet from "./MetaHelmet";
import ContentPageShell, {
  contentHeading,
  contentSubheading,
  contentText,
} from "./ContentPageShell";
import RelatedGuideLinks, { RelatedGuideLink } from "./RelatedGuideLinks";

/* ------------------------------------------------------------------ */
/* Overs helpers                                                       */
/* ------------------------------------------------------------------ */

/**
 * Parses cricket overs notation ("18.4" = 18 overs and 4 balls) into a
 * ball count. Returns null for anything that is not valid notation —
 * the part after the dot must be 0–5 because an over has six balls.
 */
export const parseOversToBalls = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const match = /^(\d+)(?:\.(\d))?$/.exec(trimmed);
  if (!match) return null;
  const overs = Number(match[1]);
  const balls = match[2] ? Number(match[2]) : 0;
  if (balls > 5) return null;
  return overs * 6 + balls;
};

export const ballsToOversNotation = (balls: number): string => {
  const whole = Math.floor(balls / 6);
  const rest = balls % 6;
  return rest === 0 ? `${whole}` : `${whole}.${rest}`;
};

const parseNumber = (value: string): number | null => {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

const fmt = (value: number, digits = 2): string =>
  Number.isFinite(value) ? value.toFixed(digits) : "—";

/* ------------------------------------------------------------------ */
/* Shared UI                                                           */
/* ------------------------------------------------------------------ */

interface CalculatorInfo {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  keywords: string;
  blurb: string;
}

export const CALCULATORS: CalculatorInfo[] = [
  {
    slug: "run-rate-calculator",
    title: "Cricket Run Rate & Required Run Rate Calculator",
    shortTitle: "Run Rate Calculator",
    description:
      "Free cricket run rate calculator. Enter runs and overs to get the current run rate, required run rate, runs needed, balls left and projected score.",
    keywords:
      "run rate calculator, required run rate calculator, cricket run rate, how to calculate run rate, RRR calculator, projected score cricket",
    blurb: "Current run rate, required run rate, balls left and projected score.",
  },
  {
    slug: "net-run-rate-calculator",
    title: "Net Run Rate (NRR) Calculator for Cricket Tournaments",
    shortTitle: "Net Run Rate Calculator",
    description:
      "Calculate a team's tournament net run rate across several matches, with correct overs conversion and the all-out rule applied automatically.",
    keywords:
      "net run rate calculator, NRR calculator, cricket NRR, how to calculate net run rate, points table NRR, tournament net run rate",
    blurb: "Tournament NRR across matches, with the all-out rule handled for you.",
  },
  {
    slug: "strike-rate-calculator",
    title: "Batting Strike Rate & Batting Average Calculator",
    shortTitle: "Strike Rate & Average Calculator",
    description:
      "Work out a batter's strike rate, batting average, boundary percentage and balls per boundary from runs, balls faced, dismissals, fours and sixes.",
    keywords:
      "strike rate calculator, batting average calculator, cricket strike rate formula, batting strike rate, boundary percentage cricket",
    blurb: "Strike rate, batting average and boundary percentage for any batter.",
  },
  {
    slug: "bowling-economy-calculator",
    title: "Bowling Economy, Average & Strike Rate Calculator",
    shortTitle: "Bowling Economy Calculator",
    description:
      "Calculate bowling economy rate, bowling average and bowling strike rate from overs, runs conceded and wickets, and see the figures written correctly.",
    keywords:
      "economy rate calculator, bowling average calculator, bowling strike rate, cricket economy formula, bowling figures",
    blurb: "Economy rate, bowling average, bowling strike rate and figures.",
  },
  {
    slug: "overs-converter",
    title: "Cricket Overs to Balls Converter (and Decimal Overs)",
    shortTitle: "Overs Converter",
    description:
      "Convert cricket overs to balls, balls to overs, and overs notation like 18.4 into true decimal overs for run rate and NRR calculations.",
    keywords:
      "overs to balls, balls to overs, cricket overs converter, decimal overs, 18.4 overs in decimal, overs calculation",
    blurb: "Overs to balls, balls to overs and true decimal overs.",
  },
  {
    slug: "rain-target-calculator",
    title: "Rain-Reduced Target Calculator for Local Cricket",
    shortTitle: "Rain Target Calculator",
    description:
      "Set a fair revised target when rain shortens a local match, using the simple average run rate method, with its limits explained clearly.",
    keywords:
      "rain target calculator, revised target cricket, reduced overs target, average run rate method, local cricket rain rules, par score",
    blurb: "A simple, transparent revised target for shortened local matches.",
  },
];

const calculatorPath = (slug: string) => `/cricket-calculators/${slug}`;

const inputSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 2.5, background: "#fff" },
} as const;

const NumberField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  helperText?: string;
  overs?: boolean;
  error?: boolean;
}> = ({ label, value, onChange, helperText, overs, error }) => (
  <TextField
    label={label}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    type={overs ? "text" : "number"}
    inputProps={{
      inputMode: "decimal",
      min: 0,
      ...(overs ? { pattern: "[0-9]*\\.?[0-5]?" } : {}),
    }}
    helperText={error ? "Use overs notation, e.g. 18.4 (balls after the dot must be 0–5)" : helperText}
    error={error}
    fullWidth
    size="small"
    sx={inputSx}
  />
);

const ResultGrid: React.FC<{ items: { label: string; value: string }[] }> = ({
  items,
}) => (
  <Box
    role="status"
    aria-live="polite"
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" },
      gap: 1.25,
      mt: 2,
    }}
  >
    {items.map((item) => (
      <Box
        key={item.label}
        sx={{
          p: 1.5,
          borderRadius: 2.5,
          background:
            "linear-gradient(135deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
          color: "#fff",
        }}
      >
        <Typography sx={{ fontSize: "calc(12px * var(--app-font-scale, 1))", opacity: 0.9, fontWeight: 600 }}>
          {item.label}
        </Typography>
        <Typography sx={{ fontSize: "calc(22px * var(--app-font-scale, 1))", fontWeight: 900 }}>
          {item.value}
        </Typography>
      </Box>
    ))}
  </Box>
);

const CalculatorCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    component="section"
    aria-label="Calculator"
    sx={{
      p: { xs: 1.75, sm: 2.5 },
      mb: 3,
      borderRadius: 3,
      background: "rgba(255,255,255,0.85)",
      border: "1.5px solid rgba(67,206,162,0.45)",
    }}
  >
    {children}
  </Box>
);

interface Faq {
  question: string;
  answer: string;
}

const CalculatorLayout: React.FC<{
  info: CalculatorInfo;
  intro: string;
  calculator: React.ReactNode;
  explanation: React.ReactNode;
  faqs: Faq[];
  related: RelatedGuideLink[];
}> = ({ info, intro, calculator, explanation, faqs, related }) => {
  const path = calculatorPath(info.slug);
  return (
    <>
      <MetaHelmet
        pageTitle={info.title}
        canonical={path}
        description={info.description}
        keywords={info.keywords}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Cricket Calculators", path: "/cricket-calculators" },
          { name: info.shortTitle, path },
        ]}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          })}
        </script>
      </Helmet>
      <ContentPageShell title={info.title} intro={intro}>
        <CalculatorCard>{calculator}</CalculatorCard>
        {explanation}
        <Box component="section" sx={{ mb: 3 }}>
          <Typography component="h2" sx={contentHeading}>
            Frequently asked questions
          </Typography>
          {faqs.map((faq) => (
            <Box key={faq.question} sx={{ mb: 2 }}>
              <Typography component="h3" sx={contentSubheading}>
                {faq.question}
              </Typography>
              <Typography sx={contentText}>{faq.answer}</Typography>
            </Box>
          ))}
        </Box>
        <RelatedGuideLinks links={related} />
        <Typography sx={{ ...contentText, mt: 2.5 }}>
          <RouterLink to="/cricket-calculators">← All cricket calculators</RouterLink>
        </Typography>
      </ContentPageShell>
    </>
  );
};

const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography component="h2" sx={contentHeading}>
    {children}
  </Typography>
);
const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography sx={{ ...contentText, mb: 1.5 }}>{children}</Typography>
);
const Formula: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      my: 1.5,
      p: 1.5,
      borderRadius: 2,
      background: "rgba(24,90,157,0.07)",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
      color: "#0f3f66",
      fontWeight: 700,
      fontSize: "calc(14px * var(--app-font-scale, 1))",
      overflowX: "auto",
    }}
  >
    {children}
  </Box>
);
const Example: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <Box
    component="aside"
    sx={{
      my: 2,
      p: { xs: 1.75, sm: 2.25 },
      borderRadius: 3,
      borderLeft: "5px solid var(--app-accent-start, #43cea2)",
      background: "rgba(67,206,162,0.12)",
    }}
  >
    <Typography sx={{ ...contentSubheading, mb: 0.5 }}>{title}</Typography>
    <Typography component="div" sx={contentText}>
      {children}
    </Typography>
  </Box>
);

const findInfo = (slug: string): CalculatorInfo =>
  CALCULATORS.find((c) => c.slug === slug) as CalculatorInfo;

/* ------------------------------------------------------------------ */
/* 1. Run rate                                                          */
/* ------------------------------------------------------------------ */

export const RunRateCalculator: React.FC = () => {
  const [runs, setRuns] = React.useState("87");
  const [overs, setOvers] = React.useState("11.4");
  const [target, setTarget] = React.useState("");
  const [totalOvers, setTotalOvers] = React.useState("20");

  const r = parseNumber(runs);
  const balls = parseOversToBalls(overs);
  const t = parseNumber(target);
  const quotaBalls = parseOversToBalls(totalOvers);

  const results: { label: string; value: string }[] = [];
  if (r !== null && balls) {
    const crr = r / (balls / 6);
    results.push({ label: "Current run rate", value: fmt(crr) });
    if (quotaBalls && quotaBalls > balls) {
      const remaining = quotaBalls - balls;
      results.push({
        label: "Projected score",
        value: `${Math.round(r + crr * (remaining / 6))}`,
      });
      if (t !== null && t > 0) {
        const needed = Math.max(0, t - r);
        results.push({ label: "Runs needed", value: `${needed}` });
        results.push({ label: "Balls left", value: `${remaining}` });
        results.push({
          label: "Required run rate",
          value: needed === 0 ? "Won" : fmt(needed / (remaining / 6)),
        });
      }
    }
  }

  return (
    <CalculatorLayout
      info={findInfo("run-rate-calculator")}
      intro="Enter the score and overs to see the current run rate. Add the target and the overs in the innings to get the required run rate and how many balls are left."
      calculator={
        <>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" }, gap: 1.5 }}>
            <NumberField label="Runs scored" value={runs} onChange={setRuns} />
            <NumberField
              label="Overs bowled"
              value={overs}
              onChange={setOvers}
              overs
              error={overs.trim() !== "" && parseOversToBalls(overs) === null}
            />
            <NumberField label="Target (optional)" value={target} onChange={setTarget} />
            <NumberField
              label="Overs in innings"
              value={totalOvers}
              onChange={setTotalOvers}
              overs
              error={totalOvers.trim() !== "" && parseOversToBalls(totalOvers) === null}
            />
          </Box>
          {results.length > 0 ? (
            <ResultGrid items={results} />
          ) : (
            <Typography sx={{ ...contentText, mt: 2 }}>
              Enter runs and overs (more than 0 balls) to see the run rate.
            </Typography>
          )}
        </>
      }
      explanation={
        <>
          <H2>How run rate is calculated</H2>
          <P>
            Run rate is simply runs per over. The one trap is the overs figure.
            Cricket writes 11.4 overs to mean eleven overs and four balls, not
            eleven and four tenths. Four balls is four sixths of an over, so
            11.4 overs is really 11.667 overs. The calculator converts the
            notation to balls first, which is why its answer can differ from
            what you get by typing 87 ÷ 11.4 into a phone calculator.
          </P>
          <Formula>Current run rate = runs ÷ (balls bowled ÷ 6)</Formula>
          <Formula>Required run rate = runs needed ÷ (balls remaining ÷ 6)</Formula>
          <P>
            The target is the number the chasing side must reach, which is one
            more than the first innings total. If Team A made 152, the target
            is 153. Projected score assumes the batting side keeps scoring at
            exactly its current rate for the rest of the innings. In real
            matches, most teams score faster at the end, so treat the
            projection as a floor rather than a forecast.
          </P>
          <Example title="Worked example">
            Chasing 153 in 20 overs, a team is 87 after 11.4 overs. That is 70
            balls, so the current rate is 87 ÷ (70 ÷ 6) = 7.46. There are 50
            balls left and 66 runs needed, so the required rate is 66 ÷ (50 ÷ 6)
            = 7.92. The chase is slightly behind, roughly one extra run every
            two overs.
          </Example>
          <H2>Reading the numbers during a chase</H2>
          <P>
            A required rate within about one run an over of the current rate
            is comfortable in limited-overs cricket, provided wickets are in
            hand. Once the gap reaches two or more, the batting side normally
            needs one or two big overs. Watch the trend over three or four
            overs rather than reacting to a single expensive ball. The guide to{" "}
            <RouterLink to="/learn/chasing-a-target-required-run-rate">
              chasing a target with required run rate
            </RouterLink>{" "}
            goes through how to plan the chase in phases.
          </P>
        </>
      }
      faqs={[
        {
          question: "Why does 11.4 overs not mean 11.4 in the formula?",
          answer:
            "The number after the dot counts balls, not tenths. An over has six balls, so 11.4 overs is 11 overs plus 4/6 of an over, which is 11.667 in decimal form. Using 11.4 directly overstates the run rate.",
        },
        {
          question: "Do wides and no-balls count in the run rate?",
          answer:
            "The runs from wides and no-balls count, because they are part of the team total. The deliveries themselves are not legal balls, so they do not add to the overs. That is why a wide raises the run rate without using up a ball.",
        },
        {
          question: "What is a good run rate in T20 cricket?",
          answer:
            "It depends on the pitch and the ball. In hard-ball T20 cricket, around 7 to 8 an over is typical, so 140 to 160 in 20 overs. In tennis-ball and box cricket with short boundaries, rates of 10 or more are common.",
        },
      ]}
      related={[
        { title: "Net Run Rate Calculator", path: calculatorPath("net-run-rate-calculator"), description: "Rank teams on a points table using NRR." },
        { title: "Overs Converter", path: calculatorPath("overs-converter"), description: "Convert overs notation into balls and true decimals." },
        { title: "Chasing a Target", path: "/learn/chasing-a-target-required-run-rate", description: "Plan a run chase over by over." },
      ]}
    />
  );
};

/* ------------------------------------------------------------------ */
/* 2. Net run rate                                                      */
/* ------------------------------------------------------------------ */

interface NrrRow {
  runsFor: string;
  oversFaced: string;
  allOutFor: boolean;
  runsAgainst: string;
  oversBowled: string;
  allOutAgainst: boolean;
}

const emptyRow: NrrRow = {
  runsFor: "",
  oversFaced: "",
  allOutFor: false,
  runsAgainst: "",
  oversBowled: "",
  allOutAgainst: false,
};

export const NetRunRateCalculator: React.FC = () => {
  const [quota, setQuota] = React.useState("20");
  const [rows, setRows] = React.useState<NrrRow[]>([
    { runsFor: "165", oversFaced: "20", allOutFor: false, runsAgainst: "140", oversBowled: "20", allOutAgainst: false },
    { runsFor: "121", oversFaced: "17.3", allOutFor: true, runsAgainst: "124", oversBowled: "18.4", allOutAgainst: false },
  ]);

  const quotaBalls = parseOversToBalls(quota);

  const updateRow = (index: number, patch: Partial<NrrRow>) =>
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  let totalRunsFor = 0;
  let totalBallsFaced = 0;
  let totalRunsAgainst = 0;
  let totalBallsBowled = 0;
  let validRows = 0;

  rows.forEach((row) => {
    const rf = parseNumber(row.runsFor);
    const ra = parseNumber(row.runsAgainst);
    const bf = row.allOutFor ? quotaBalls : parseOversToBalls(row.oversFaced);
    const bb = row.allOutAgainst ? quotaBalls : parseOversToBalls(row.oversBowled);
    if (rf === null || ra === null || !bf || !bb) return;
    totalRunsFor += rf;
    totalBallsFaced += bf;
    totalRunsAgainst += ra;
    totalBallsBowled += bb;
    validRows += 1;
  });

  const rateFor = totalBallsFaced ? totalRunsFor / (totalBallsFaced / 6) : NaN;
  const rateAgainst = totalBallsBowled ? totalRunsAgainst / (totalBallsBowled / 6) : NaN;
  const nrr = rateFor - rateAgainst;

  return (
    <CalculatorLayout
      info={findInfo("net-run-rate-calculator")}
      intro="Add one row per match. Tick 'all out' when a side was bowled out, and the calculator counts the full quota of overs for that innings, as the standard NRR method requires."
      calculator={
        <>
          <Box sx={{ maxWidth: 220, mb: 2 }}>
            <NumberField
              label="Overs per innings"
              value={quota}
              onChange={setQuota}
              overs
              error={quota.trim() !== "" && quotaBalls === null}
            />
          </Box>
          {rows.map((row, index) => (
            <Box
              key={index}
              sx={{
                p: 1.5,
                mb: 1.5,
                borderRadius: 2.5,
                border: "1px solid rgba(24,90,157,0.15)",
                background: "rgba(248,255,252,0.9)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography sx={{ fontWeight: 800, color: "#0f3f66" }}>Match {index + 1}</Typography>
                {rows.length > 1 ? (
                  <IconButton
                    aria-label={`Remove match ${index + 1}`}
                    size="small"
                    onClick={() => setRows((current) => current.filter((_, i) => i !== index))}
                  >
                    <DeleteOutlineRounded fontSize="small" />
                  </IconButton>
                ) : null}
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" }, gap: 1.25, alignItems: "start" }}>
                <NumberField label="Runs scored" value={row.runsFor} onChange={(v) => updateRow(index, { runsFor: v })} />
                <Box>
                  <NumberField
                    label="Overs faced"
                    value={row.allOutFor ? quota : row.oversFaced}
                    onChange={(v) => updateRow(index, { oversFaced: v })}
                    overs
                    error={!row.allOutFor && row.oversFaced.trim() !== "" && parseOversToBalls(row.oversFaced) === null}
                  />
                  <FormControlLabel
                    control={<Checkbox size="small" checked={row.allOutFor} onChange={(e) => updateRow(index, { allOutFor: e.target.checked })} />}
                    label="We were all out"
                    sx={{ "& .MuiFormControlLabel-label": { fontSize: 13 } }}
                  />
                </Box>
                <NumberField label="Runs conceded" value={row.runsAgainst} onChange={(v) => updateRow(index, { runsAgainst: v })} />
                <Box>
                  <NumberField
                    label="Overs bowled"
                    value={row.allOutAgainst ? quota : row.oversBowled}
                    onChange={(v) => updateRow(index, { oversBowled: v })}
                    overs
                    error={!row.allOutAgainst && row.oversBowled.trim() !== "" && parseOversToBalls(row.oversBowled) === null}
                  />
                  <FormControlLabel
                    control={<Checkbox size="small" checked={row.allOutAgainst} onChange={(e) => updateRow(index, { allOutAgainst: e.target.checked })} />}
                    label="Opponent all out"
                    sx={{ "& .MuiFormControlLabel-label": { fontSize: 13 } }}
                  />
                </Box>
              </Box>
            </Box>
          ))}
          <Button
            variant="outlined"
            onClick={() => setRows((current) => [...current, { ...emptyRow }])}
            sx={{ borderRadius: 999, fontWeight: 700 }}
          >
            Add match
          </Button>
          {validRows > 0 ? (
            <ResultGrid
              items={[
                { label: "Net run rate", value: `${nrr >= 0 ? "+" : ""}${fmt(nrr, 3)}` },
                { label: "Run rate for", value: fmt(rateFor, 3) },
                { label: "Run rate against", value: fmt(rateAgainst, 3) },
                { label: "Runs for / overs", value: `${totalRunsFor} / ${ballsToOversNotation(totalBallsFaced)}` },
                { label: "Runs against / overs", value: `${totalRunsAgainst} / ${ballsToOversNotation(totalBallsBowled)}` },
                { label: "Matches counted", value: `${validRows}` },
              ]}
            />
          ) : (
            <Typography sx={{ ...contentText, mt: 2 }}>Fill in at least one complete match.</Typography>
          )}
        </>
      }
      explanation={
        <>
          <H2>The net run rate formula</H2>
          <P>
            Net run rate compares how fast a team scored with how fast its
            opponents scored against it, across the whole tournament. You add
            up all the runs and all the overs first, then divide. Averaging the
            NRR from each match gives a different, wrong answer, so the
            calculator always works from the totals.
          </P>
          <Formula>
            NRR = (total runs scored ÷ total overs faced) − (total runs conceded ÷ total overs bowled)
          </Formula>
          <P>
            Two rules trip people up. First, overs must be converted to balls
            or true decimals: 17.3 overs is 17.5, not 17.3. Second, when a side
            is bowled out, the full quota of overs counts for that innings, no
            matter how early the collapse came. A team all out for 121 in 17.3
            overs of a 20-over match is treated as scoring 121 in 20 overs.
          </P>
          <Example title="Worked example (the default numbers above)">
            Match 1: scored 165 in 20 overs, conceded 140 in 20. Match 2: all
            out for 121 (counted as 20 overs), and the opponents chased 124 in
            18.4 overs. Totals: 286 runs in 40 overs = 7.150 per over for, and
            264 runs in 38.667 overs = 6.828 per over against. NRR = 7.150 −
            6.828 = +0.322.
          </Example>
          <H2>When NRR matters, and what to check</H2>
          <P>
            NRR only separates teams that are level on points, so it usually
            decides the last semi-final spot. Before the final round, work out
            the margin your team needs: a different number of runs if you bat
            first, or a number of overs to chase in if you bat second. Matches
            that are abandoned with no result are normally left out of NRR
            entirely. For the full method, including how rain-reduced matches
            are counted, read{" "}
            <RouterLink to="/learn/net-run-rate-explained">net run rate explained</RouterLink>.
            If you run your tournament in Cricket Score Counter, the points
            table works out NRR for you after every match.
          </P>
        </>
      }
      faqs={[
        {
          question: "Why does an all-out team count the full overs?",
          answer:
            "Otherwise a side that collapsed quickly would have a high run rate from very few overs, which would reward being bowled out. Counting the full quota means losing all ten wickets is treated as using up the whole innings.",
        },
        {
          question: "Can net run rate be negative?",
          answer:
            "Yes. A negative NRR means the team has conceded runs faster than it has scored them across the tournament. Teams that have lost heavily, or only won narrowly, often have a negative figure.",
        },
        {
          question: "How many decimal places should NRR use?",
          answer:
            "Points tables usually show three decimal places, for example +0.322. Keep full precision while calculating and round only at the end, otherwise two close teams can appear to be tied when they are not.",
        },
      ]}
      related={[
        { title: "Net Run Rate Explained", path: "/learn/net-run-rate-explained", description: "The full method with more worked examples." },
        { title: "Run Rate Calculator", path: calculatorPath("run-rate-calculator"), description: "Current and required run rate for a single innings." },
        { title: "Cricket Tournament Guide", path: "/cricket-tournament-guide", description: "Run a league with an automatic points table." },
      ]}
    />
  );
};

/* ------------------------------------------------------------------ */
/* 3. Strike rate / batting average                                     */
/* ------------------------------------------------------------------ */

export const StrikeRateCalculator: React.FC = () => {
  const [runs, setRuns] = React.useState("48");
  const [balls, setBalls] = React.useState("33");
  const [outs, setOuts] = React.useState("1");
  const [fours, setFours] = React.useState("5");
  const [sixes, setSixes] = React.useState("2");

  const r = parseNumber(runs);
  const b = parseNumber(balls);
  const o = parseNumber(outs);
  const f = parseNumber(fours) ?? 0;
  const s = parseNumber(sixes) ?? 0;

  const items: { label: string; value: string }[] = [];
  if (r !== null && b) items.push({ label: "Strike rate", value: fmt((r / b) * 100) });
  if (r !== null && o !== null) {
    items.push({ label: "Batting average", value: o > 0 ? fmt(r / o) : "No dismissals" });
  }
  if (r && f + s > 0) {
    items.push({ label: "Runs in boundaries", value: `${fmt(((f * 4 + s * 6) / r) * 100, 1)}%` });
    if (b) items.push({ label: "Balls per boundary", value: fmt(b / (f + s), 1) });
  }

  return (
    <CalculatorLayout
      info={findInfo("strike-rate-calculator")}
      intro="Enter a batter's runs and balls faced for strike rate. Add the number of times they were dismissed for the batting average, and fours and sixes for boundary stats. Works for one innings or a whole season."
      calculator={
        <>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(5, 1fr)" }, gap: 1.5 }}>
            <NumberField label="Runs" value={runs} onChange={setRuns} />
            <NumberField label="Balls faced" value={balls} onChange={setBalls} />
            <NumberField label="Times out" value={outs} onChange={setOuts} />
            <NumberField label="Fours" value={fours} onChange={setFours} />
            <NumberField label="Sixes" value={sixes} onChange={setSixes} />
          </Box>
          {items.length ? (
            <ResultGrid items={items} />
          ) : (
            <Typography sx={{ ...contentText, mt: 2 }}>Enter runs and balls faced.</Typography>
          )}
        </>
      }
      explanation={
        <>
          <H2>Strike rate and average: two different questions</H2>
          <P>
            Strike rate answers “how quickly does this batter score?” It is
            runs per 100 balls faced. Batting average answers “how many runs
            does this batter make before getting out?” It is runs divided by
            the number of dismissals, not by the number of innings. That
            distinction matters: not-out innings add runs but not dismissals,
            which is why a batter with lots of not-outs can average more than
            their highest score.
          </P>
          <Formula>Strike rate = (runs ÷ balls faced) × 100</Formula>
          <Formula>Batting average = runs ÷ times dismissed</Formula>
          <P>
            Balls faced include dot balls and no-balls the batter receives,
            but not wides, because a wide is not considered to have been faced.
            Retired hurt is not a dismissal, so it does not count as an out.
            Retired out does count as a dismissal.
          </P>
          <Example title="Worked example">
            A batter makes 48 off 33 balls with five fours and two sixes and
            is out once. Strike rate = 48 ÷ 33 × 100 = 145.45. Average = 48.
            Boundaries are worth 20 + 12 = 32 runs, so 66.7% of their runs
            came in boundaries, and they found the rope once every 4.7 balls.
          </Example>
          <H2>Putting the numbers in context</H2>
          <P>
            In T20 cricket a strike rate above 130 is generally good, and
            above 150 is excellent for a top-order batter. In longer formats,
            strike rate matters less and average matters more. A high boundary
            percentage with a modest strike rate usually means a batter is
            struggling to rotate the strike between boundaries, which is the
            first thing to work on. See{" "}
            <RouterLink to="/learn/batting-tips-for-beginners">batting tips for beginners</RouterLink>{" "}
            for drills that help.
          </P>
        </>
      }
      faqs={[
        {
          question: "What if a batter has never been out?",
          answer:
            "Their batting average is undefined, because you cannot divide by zero. Scorecards normally show a dash. Their strike rate still works as long as they have faced at least one ball.",
        },
        {
          question: "Do wides count as balls faced?",
          answer:
            "No. A wide is not a legal delivery and the batter is not considered to have faced it. A no-ball does count as a ball faced by the striker, even though it does not count towards the over.",
        },
        {
          question: "Is strike rate in cricket the same for batters and bowlers?",
          answer:
            "No. Batting strike rate is runs per 100 balls. Bowling strike rate is balls bowled per wicket, where lower is better. Use the bowling economy calculator for the bowling version.",
        },
      ]}
      related={[
        { title: "Bowling Economy Calculator", path: calculatorPath("bowling-economy-calculator"), description: "Economy, bowling average and bowling strike rate." },
        { title: "Cricket Statistics Explained", path: "/cricket-statistics-guide", description: "Every common cricket statistic with its formula." },
        { title: "How to Read a Scorecard", path: "/learn/how-to-read-a-cricket-scorecard", description: "Understand every column on a batting card." },
      ]}
    />
  );
};

/* ------------------------------------------------------------------ */
/* 4. Bowling economy                                                   */
/* ------------------------------------------------------------------ */

export const BowlingEconomyCalculator: React.FC = () => {
  const [overs, setOvers] = React.useState("4");
  const [maidens, setMaidens] = React.useState("0");
  const [runs, setRuns] = React.useState("28");
  const [wickets, setWickets] = React.useState("2");

  const balls = parseOversToBalls(overs);
  const r = parseNumber(runs);
  const w = parseNumber(wickets);
  const m = parseNumber(maidens) ?? 0;

  const items: { label: string; value: string }[] = [];
  if (balls && r !== null) {
    items.push({ label: "Economy rate", value: fmt(r / (balls / 6)) });
    items.push({ label: "Figures (O-M-R-W)", value: `${ballsToOversNotation(balls)}-${m}-${r}-${w ?? 0}` });
    if (w !== null) {
      items.push({ label: "Bowling average", value: w > 0 ? fmt(r / w) : "No wickets" });
      items.push({ label: "Bowling strike rate", value: w > 0 ? fmt(balls / w, 1) : "No wickets" });
    }
    items.push({ label: "Dot-ball target", value: `${Math.ceil(balls * 0.4)} of ${balls}` });
  }

  return (
    <CalculatorLayout
      info={findInfo("bowling-economy-calculator")}
      intro="Enter overs in cricket notation (for example 3.4), runs conceded and wickets. You get economy, bowling average, bowling strike rate and the figures written the standard way."
      calculator={
        <>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" }, gap: 1.5 }}>
            <NumberField
              label="Overs bowled"
              value={overs}
              onChange={setOvers}
              overs
              error={overs.trim() !== "" && balls === null}
            />
            <NumberField label="Maidens" value={maidens} onChange={setMaidens} />
            <NumberField label="Runs conceded" value={runs} onChange={setRuns} />
            <NumberField label="Wickets" value={wickets} onChange={setWickets} />
          </Box>
          {items.length ? (
            <ResultGrid items={items} />
          ) : (
            <Typography sx={{ ...contentText, mt: 2 }}>Enter overs and runs conceded.</Typography>
          )}
        </>
      }
      explanation={
        <>
          <H2>The three bowling numbers</H2>
          <P>
            Economy rate is runs conceded per over and shows how hard a bowler
            is to score off. Bowling average is runs conceded per wicket and
            shows what each wicket “costs”. Bowling strike rate is balls bowled
            per wicket and shows how often a bowler takes one. For all three,
            lower is better.
          </P>
          <Formula>Economy = runs conceded ÷ (balls bowled ÷ 6)</Formula>
          <Formula>Bowling average = runs conceded ÷ wickets</Formula>
          <Formula>Bowling strike rate = balls bowled ÷ wickets</Formula>
          <P>
            Runs conceded include wides and no-balls, because they are charged
            to the bowler. Byes and leg byes are not. Only bowled, caught, LBW,
            stumped and hit wicket count as the bowler's wickets; run outs do
            not. The{" "}
            <RouterLink to="/learn/how-wickets-are-credited">guide to which dismissals count for the bowler</RouterLink>{" "}
            explains each case.
          </P>
          <Example title="Worked example">
            A bowler finishes with 3.4 overs, 0 maidens, 31 runs and 3 wickets.
            3.4 overs is 22 balls. Economy = 31 ÷ (22 ÷ 6) = 8.45. Average =
            31 ÷ 3 = 10.33. Strike rate = 22 ÷ 3 = 7.3 balls per wicket. The
            figures are written 3.4-0-31-3.
          </Example>
          <P>
            The dot-ball target in the results is a coaching guide rather than
            a statistic: in T20 cricket, bowling around 40% dot balls usually
            keeps the economy below eight.
          </P>
        </>
      }
      faqs={[
        {
          question: "What is a good economy rate?",
          answer:
            "In hard-ball T20 cricket, under 7 is very good and 7 to 8 is solid. In 50-over cricket, under 5 is good. Tennis-ball and box cricket run much higher because of short boundaries, so compare bowlers within the same format.",
        },
        {
          question: "Are wides and no-balls included in economy?",
          answer:
            "Yes. The penalty run and any runs scored from wides and no-balls are debited to the bowler. Byes and leg byes are not, because they are not the bowler's fault under the scoring conventions.",
        },
        {
          question: "What is a maiden over?",
          answer:
            "An over of six legal balls in which no runs are charged to the bowler. Byes and leg byes do not spoil a maiden, but a wide or a no-ball does.",
        },
      ]}
      related={[
        { title: "Strike Rate Calculator", path: calculatorPath("strike-rate-calculator"), description: "The batting side of the numbers." },
        { title: "Death Overs Bowling Tips", path: "/learn/death-overs-bowling-tips", description: "Keep the economy down at the end of an innings." },
        { title: "Byes and Leg Byes", path: "/learn/byes-and-leg-byes-explained", description: "Why these extras do not count against the bowler." },
      ]}
    />
  );
};

/* ------------------------------------------------------------------ */
/* 5. Overs converter                                                   */
/* ------------------------------------------------------------------ */

export const OversConverter: React.FC = () => {
  const [overs, setOvers] = React.useState("18.4");
  const [balls, setBalls] = React.useState("100");

  const fromOvers = parseOversToBalls(overs);
  const b = parseNumber(balls);
  const ballCount = b !== null ? Math.floor(b) : null;

  return (
    <CalculatorLayout
      info={findInfo("overs-converter")}
      intro="Convert between cricket overs notation, number of balls and true decimal overs. Use the decimal value whenever you calculate a rate."
      calculator={
        <>
          <Typography sx={{ ...contentSubheading }}>Overs → balls and decimal</Typography>
          <Box sx={{ maxWidth: 260 }}>
            <NumberField
              label="Overs (e.g. 18.4)"
              value={overs}
              onChange={setOvers}
              overs
              error={overs.trim() !== "" && fromOvers === null}
            />
          </Box>
          {fromOvers !== null ? (
            <ResultGrid
              items={[
                { label: "Balls", value: `${fromOvers}` },
                { label: "Decimal overs", value: fmt(fromOvers / 6, 3) },
                { label: "Balls left in a 20-over innings", value: fromOvers <= 120 ? `${120 - fromOvers}` : "—" },
              ]}
            />
          ) : null}
          <Typography sx={{ ...contentSubheading, mt: 3 }}>Balls → overs</Typography>
          <Box sx={{ maxWidth: 260 }}>
            <NumberField label="Balls" value={balls} onChange={setBalls} />
          </Box>
          {ballCount !== null ? (
            <ResultGrid
              items={[
                { label: "Overs notation", value: ballsToOversNotation(ballCount) },
                { label: "Decimal overs", value: fmt(ballCount / 6, 3) },
              ]}
            />
          ) : null}
        </>
      }
      explanation={
        <>
          <H2>Why cricket overs are not decimals</H2>
          <P>
            An over has six legal balls, so the scorebook counts in base six
            after the dot. 18.4 overs means 18 complete overs and 4 balls of
            the 19th. You will never see 18.6: after the sixth ball the over is
            complete and the count rolls over to 19. That is why the number
            after the dot can only be 0 to 5.
          </P>
          <P>
            Spreadsheets and calculators do not know this. If you divide runs
            by 18.4 you are treating 4 balls as 0.4 of an over when it is
            really 0.667, and the run rate comes out too high. Convert to
            balls, divide by six, and use that.
          </P>
          <Box
            component="table"
            sx={{
              width: "100%",
              borderCollapse: "collapse",
              my: 2,
              background: "#fff",
              borderRadius: 2,
              overflow: "hidden",
              "& th, & td": { p: 1, borderBottom: "1px solid rgba(24,90,157,0.12)", textAlign: "left", color: "#1b3a57" },
              "& th": { background: "rgba(67,206,162,0.16)", fontWeight: 800 },
            }}
          >
            <caption style={{ textAlign: "left", fontWeight: 700, color: "#185a9d", padding: "6px 0" }}>
              Balls after the dot and their decimal value
            </caption>
            <thead>
              <tr>
                <th>Notation</th>
                <th>Balls into the over</th>
                <th>Decimal part</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((n) => (
                <tr key={n}>
                  <td>x.{n}</td>
                  <td>{n}</td>
                  <td>{fmt(n / 6, 3).replace(/^0/, "")}</td>
                </tr>
              ))}
            </tbody>
          </Box>
          <Example title="Worked example">
            A team scores 143 in 18.4 overs. 18.4 overs = 18 × 6 + 4 = 112
            balls = 18.667 decimal overs. Run rate = 143 ÷ 18.667 = 7.66. Using
            18.4 directly would give 7.77, which is wrong.
          </Example>
          <H2>Do extras change the overs?</H2>
          <P>
            Wides and no-balls are not legal deliveries, so they never move
            the overs count, however many are bowled. Byes and leg byes come
            from legal balls, so they do. If your overs total looks wrong at
            the end of an innings, an unrecorded wide or no-ball is usually
            the reason. See{" "}
            <RouterLink to="/learn/how-to-score-wides">how to score a wide</RouterLink>.
          </P>
        </>
      }
      faqs={[
        {
          question: "How many balls are in 20 overs?",
          answer: "120 legal balls. A 10-over innings has 60, 6 overs has 36, and a 50-over innings has 300.",
        },
        {
          question: "What does 0.3 overs mean?",
          answer: "Three legal balls, which is half an over. In decimal it is 0.5 overs.",
        },
        {
          question: "Can an over have more than six balls?",
          answer:
            "It can have more than six deliveries, because wides and no-balls are re-bowled. It always has exactly six legal balls, unless an umpire miscounts, in which case the over as bowled stands.",
        },
      ]}
      related={[
        { title: "Run Rate Calculator", path: calculatorPath("run-rate-calculator"), description: "Use the converted overs to get the run rate." },
        { title: "Net Run Rate Calculator", path: calculatorPath("net-run-rate-calculator"), description: "Where the overs conversion matters most." },
        { title: "Strike Rotation Explained", path: "/learn/strike-rotation-explained", description: "What happens at the end of each over." },
      ]}
    />
  );
};

/* ------------------------------------------------------------------ */
/* 6. Rain target (average run rate method)                             */
/* ------------------------------------------------------------------ */

export const RainTargetCalculator: React.FC = () => {
  const [runs, setRuns] = React.useState("152");
  const [teamOneOvers, setTeamOneOvers] = React.useState("20");
  const [teamTwoOvers, setTeamTwoOvers] = React.useState("12");

  const r = parseNumber(runs);
  const b1 = parseOversToBalls(teamOneOvers);
  const b2 = parseOversToBalls(teamTwoOvers);

  const valid = r !== null && b1 && b2;
  const par = valid ? (r as number) * ((b2 as number) / (b1 as number)) : NaN;
  const target = valid ? Math.floor(par) + 1 : NaN;

  return (
    <CalculatorLayout
      info={findInfo("rain-target-calculator")}
      intro="When rain or bad light cuts the second innings, this gives a revised target by scaling the first-innings score to the overs the chasing side will get. It is a simple local-cricket method, not the official DLS calculation."
      calculator={
        <>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 1.5 }}>
            <NumberField label="Team 1 score" value={runs} onChange={setRuns} />
            <NumberField
              label="Team 1 overs available"
              value={teamOneOvers}
              onChange={setTeamOneOvers}
              overs
              helperText="Use the full quota if they were all out"
              error={teamOneOvers.trim() !== "" && b1 === null}
            />
            <NumberField
              label="Team 2 overs available"
              value={teamTwoOvers}
              onChange={setTeamTwoOvers}
              overs
              error={teamTwoOvers.trim() !== "" && b2 === null}
            />
          </Box>
          {valid ? (
            <ResultGrid
              items={[
                { label: "Revised target", value: `${target}` },
                { label: "Par score (tie)", value: `${Math.floor(par)}` },
                { label: "Required run rate", value: fmt(target / ((b2 as number) / 6)) },
              ]}
            />
          ) : (
            <Typography sx={{ ...contentText, mt: 2 }}>Enter the score and both overs figures.</Typography>
          )}
        </>
      }
      explanation={
        <>
          <H2>How the average run rate method works</H2>
          <P>
            The method assumes the chasing side should score at the same rate
            as the side batting first. Team 1's runs are scaled by the share
            of overs Team 2 will receive. The par score is the scaled total
            rounded down, and the target is one more than par.
          </P>
          <Formula>Par = Team 1 runs × (Team 2 overs ÷ Team 1 overs)</Formula>
          <Formula>Target = par rounded down + 1</Formula>
          <Example title="Worked example">
            Team 1 makes 152 in 20 overs. Rain leaves time for only 12 overs in
            the chase. Par = 152 × 12 ÷ 20 = 91.2, so par is 91 and the target
            is 92 in 12 overs, a required rate of 7.67.
          </Example>
          <H2>Its weakness, and how to make it fairer</H2>
          <P>
            This method ignores wickets. A chasing side with ten wickets and
            only 12 overs can attack from ball one, which makes the target
            easier than it looks. That is the problem the{" "}
            <RouterLink to="/learn/duckworth-lewis-stern-explained">Duckworth–Lewis–Stern method</RouterLink>{" "}
            solves by treating overs and wickets together as “resources”. DLS
            needs official software, though, so most local games use a simple
            agreed method instead.
          </P>
          <P>
            The fairest local approach is to agree the rain rule before the
            toss, write it down, and stick to it. Some leagues add a small
            uplift to the target, or use the most productive overs method
            (Team 2 must beat the runs Team 1 scored in its best overs). Our
            guide to{" "}
            <RouterLink to="/learn/shortened-match-targets">rain-shortened matches</RouterLink>{" "}
            compares these options with examples.
          </P>
        </>
      }
      faqs={[
        {
          question: "Is this the same as DLS?",
          answer:
            "No. DLS accounts for wickets as well as overs and is calculated with official software. This calculator uses the simple average run rate method, which many local and school matches use because everyone can check it by hand.",
        },
        {
          question: "What if Team 1's innings was also shortened?",
          answer:
            "Enter the overs Team 1 actually had available. If they were all out, enter the full overs they were allotted, because being bowled out counts as using the whole innings.",
        },
        {
          question: "What happens if Team 2 scores exactly the par score?",
          answer:
            "The match is a tie on the revised calculation. Many local competitions then use a super over or share the points, so agree the tie rule before the match too.",
        },
      ]}
      related={[
        { title: "Rain-Shortened Match Targets", path: "/learn/shortened-match-targets", description: "Compare the local methods in detail." },
        { title: "DLS Explained Simply", path: "/learn/duckworth-lewis-stern-explained", description: "What the official method does differently." },
        { title: "Run Rate Calculator", path: calculatorPath("run-rate-calculator"), description: "Track the required rate once the chase starts." },
      ]}
    />
  );
};

/* ------------------------------------------------------------------ */
/* Hub                                                                  */
/* ------------------------------------------------------------------ */

const CricketCalculatorsHub: React.FC = () => (
  <>
    <MetaHelmet
      pageTitle="Free Cricket Calculators — Run Rate, NRR, Strike Rate & More"
      canonical="/cricket-calculators"
      description="Free cricket calculators: run rate and required run rate, tournament net run rate, strike rate, batting average, bowling economy, overs conversion and rain targets."
      keywords="cricket calculator, run rate calculator, net run rate calculator, strike rate calculator, economy rate calculator, overs calculator, cricket rain target"
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Cricket Calculators", path: "/cricket-calculators" },
      ]}
    />
    <ContentPageShell
      title="Cricket Calculators"
      intro="Quick, accurate calculators for the numbers scorers and captains argue about most."
    >
      <Typography sx={{ ...contentText, mb: 1.5 }}>
        Every calculator here handles cricket's overs notation properly, so
        18.4 overs is treated as 18 overs and 4 balls, not 18.4. Each page
        explains the formula, shows a worked example you can check by hand,
        and links to a longer guide if you want the full background.
      </Typography>
      <Typography sx={{ ...contentText, mb: 2.5 }}>
        They work on any phone and need no sign-up. If you score your matches
        in Cricket Score Counter, run rate, required run rate, player figures
        and tournament net run rate are calculated for you automatically.
      </Typography>
      <Box
        component="ul"
        sx={{
          listStyle: "none",
          p: 0,
          m: 0,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 1.5,
          mb: 3,
        }}
      >
        {CALCULATORS.map((calc) => (
          <Box component="li" key={calc.slug}>
            <Box
              component={RouterLink}
              to={calculatorPath(calc.slug)}
              sx={{
                display: "block",
                height: "100%",
                p: 2,
                borderRadius: 3,
                textDecoration: "none",
                background: "rgba(255,255,255,0.85)",
                border: "1.5px solid rgba(67,206,162,0.35)",
                "&:hover": { boxShadow: "0 10px 22px rgba(8,26,56,0.12)" },
              }}
            >
              <Typography component="h2" sx={{ ...contentSubheading, color: "#185a9d" }}>
                {calc.shortTitle}
              </Typography>
              <Typography sx={{ ...contentText, fontSize: "calc(14px * var(--app-font-scale, 1))" }}>
                {calc.blurb}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <Typography component="h2" sx={contentHeading}>
        Which calculator do I need?
      </Typography>
      <Box component="ul" sx={{ ...contentText, pl: 3 }}>
        <li>During a chase: the run rate calculator, for required rate and balls left.</li>
        <li>Before the last round of a league: the net run rate calculator.</li>
        <li>For end-of-season awards: the strike rate and bowling economy calculators.</li>
        <li>When rain arrives: the rain target calculator, using a method agreed before the toss.</li>
        <li>When a spreadsheet gives odd answers: the overs converter.</li>
      </Box>
      <RelatedGuideLinks
        links={[
          { title: "Cricket Statistics Explained", path: "/cricket-statistics-guide", description: "Background on every statistic these tools calculate." },
          { title: "Learn Cricket", path: "/learn", description: "In-depth guides on scoring, laws, strategy and local cricket." },
          { title: "Cricket Glossary", path: "/cricket-glossary", description: "150+ cricket terms defined in plain English." },
        ]}
      />
    </ContentPageShell>
  </>
);

const CALCULATOR_COMPONENTS: Record<string, React.FC> = {
  "run-rate-calculator": RunRateCalculator,
  "net-run-rate-calculator": NetRunRateCalculator,
  "strike-rate-calculator": StrikeRateCalculator,
  "bowling-economy-calculator": BowlingEconomyCalculator,
  "overs-converter": OversConverter,
  "rain-target-calculator": RainTargetCalculator,
};

/** Single route entry: /cricket-calculators and /cricket-calculators/:slug */
const CricketCalculatorsPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  if (!slug) return <CricketCalculatorsHub />;
  const Calculator = CALCULATOR_COMPONENTS[slug];
  return Calculator ? <Calculator /> : <NotFound />;
};

export default CricketCalculatorsPage;
