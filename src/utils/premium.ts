// Central list of features planned for the Premium plan.
//
// Billing isn't live yet, so every feature is unlocked for now. When the
// subscription ships, make `isPremiumFeatureUnlocked` check the user's
// entitlement and every gated screen picks it up automatically.
export type PremiumFeature =
  | "playerCareerProfile"
  | "playerCharts"
  | "tournamentRecords"
  | "tournamentAdvancedStats";

export const PREMIUM_FEATURES: Record<PremiumFeature, string> = {
  playerCareerProfile: "Career profile across all tournaments and matches",
  playerCharts: "Form and performance charts",
  tournamentRecords: "Tournament records: best innings, bowling and partnerships",
  tournamentAdvancedStats: "Averages, strike rates, economy and milestones",
};

export const isPremiumFeatureUnlocked = (_feature: PremiumFeature): boolean => true;
