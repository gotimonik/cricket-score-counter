import "@testing-library/jest-dom";
import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import ViewCricketScorer from "../ViewCricketScorer";

// Fake live socket: records mockListeners so the test can push score updates.
// eslint-disable-next-line no-var
var mockListeners: Record<string, (data: unknown) => void> = {};
jest.mock("../../services/WebSocketService", () => ({
  __esModule: true,
  default: class FakeWebSocketService {
    isLoading() { return false; }
    hasConnectionError() { return false; }
    isConnected() { return true; }
    sendOnEveryConnect() {}
    send() {}
    startListening(event: string, cb: (data: unknown) => void) { mockListeners[event] = cb; }
    stopListening() {}
    close() {}
  },
}));
jest.mock("../AppBar", () => () => null);
// CRA's Jest can't load react-router 7; the page only needs these hooks.
// eslint-disable-next-line no-var
var mockCode = "";
jest.mock(
  "react-router-dom",
  () => ({
    useParams: () => ({ gameId: mockCode }),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: `/join-game/${mockCode}`, search: "", state: null }),
    Link: ({ children }: { children: unknown }) => children,
  }),
  { virtual: true },
);
jest.mock("../MetaHelmet", () => () => null);

const casualState = {
  score: 22, wickets: 0, teams: ["INDIA A", "INDIA B"], currentOver: 1, currentBallOfOver: 4,
  targetOvers: 8, totalBalls: 48, remainingBalls: 0, winningTeam: "", targetScore: 0,
  recentEvents: {}, recentEventsByTeams: {}, gameId: "ABC123",
};

const renderAt = (code: string) => {
  mockCode = code;
  return render(<ViewCricketScorer />);
};

const push = (event: string, payload: unknown) =>
  act(() => {
    mockListeners[event](JSON.stringify(payload));
  });

beforeEach(() => {
  localStorage.clear();
  Object.keys(mockListeners).forEach((key) => delete mockListeners[key]);
  (global as any).fetch = jest.fn();
});

test("viewers are told when the scorer closes a casual match without ending it", async () => {
  renderAt("ABC123");
  push("GAME_SCORE_UPDATED", casualState);
  await waitFor(() => expect(screen.getAllByText("22/0").length).toBeGreaterThan(0));
  expect(screen.queryByTestId("live-status-card")).not.toBeInTheDocument();

  push("GAME_STATUS", { gameId: "ABC123", status: "scorer_offline" });
  expect(await screen.findByText("Scorer is offline")).toBeInTheDocument();

  push("GAME_STATUS", { gameId: "ABC123", status: "ended", reason: "scorer_left" });
  expect(await screen.findByText("This match has ended")).toBeInTheDocument();
  expect(screen.getByText(/closed the match without finishing it/)).toBeInTheDocument();
  expect(screen.getByText("See live matches")).toBeInTheDocument();
  // The dead match's score isn't cached for the next visit.
  expect(localStorage.getItem("cricket-view-score-state:ABC123")).toBeNull();

  // Scoring resumes on the same code: back to live.
  push("GAME_SCORE_UPDATED", { ...casualState, score: 24 });
  await waitFor(() => expect(screen.queryByTestId("live-status-card")).not.toBeInTheDocument());
});

test("an unknown or finished code says it isn't live instead of waiting forever", async () => {
  renderAt("ZZZ999");
  push("GAME_STATUS", { gameId: "ZZZ999", status: "not_found" });
  expect(await screen.findByText(/No live match with code/)).toBeInTheDocument();
});

test("viewers see a notice when the scorer resets the match", async () => {
  renderAt("ABC123");
  push("GAME_SCORE_UPDATED", casualState);
  await waitFor(() => expect(screen.getAllByText("22/0").length).toBeGreaterThan(0));
  push("GAME_SCORE_UPDATED", { ...casualState, score: 0, currentOver: 0, currentBallOfOver: 0 });
  expect(await screen.findByText(/The scorer reset the match/)).toBeInTheDocument();
});
