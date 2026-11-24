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

const savedMatch = {
  code: "TABC234",
  status: "in_progress",
  tournamentName: "Pune Premier League",
  team1: { name: "Tigers", logoUrl: "" },
  team2: { name: "Lions", logoUrl: "" },
  winnerTeamName: "",
  resultText: "",
  snapshot: {
    score: 42, wickets: 1, teams: ["Tigers", "Lions"], currentOver: 3, currentBallOfOver: 0,
    targetOvers: 5, totalBalls: 30, remainingBalls: 12, winningTeam: "", targetScore: 0,
    recentEvents: {}, recentEventsByTeams: {},
  },
};

const renderAt = (code: string) => {
  mockCode = code;
  return render(<ViewCricketScorer />);
};

beforeEach(() => {
  localStorage.clear();
  Object.keys(mockListeners).forEach((key) => delete mockListeners[key]);
  (global as any).fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ match: savedMatch }) });
});

test("a shared tournament match shows the saved score, then switches to live updates", async () => {
  renderAt("TABC234");
  expect(await screen.findByText("Pune Premier League")).toBeInTheDocument();
  expect((global as any).fetch).toHaveBeenCalledWith(expect.stringContaining("/api/v1/live/TABC234"));
  await waitFor(() => expect(screen.getAllByText("42/1").length).toBeGreaterThan(0));
  expect(screen.getByText(/Score saved at the end of the last over/)).toBeInTheDocument();

  act(() => {
    mockListeners.GAME_SCORE_UPDATED(
      JSON.stringify({ ...savedMatch.snapshot, score: 50, wickets: 2, currentBallOfOver: 2, gameId: "TABC234" }),
    );
  });
  await waitFor(() => expect(screen.getAllByText("50/2").length).toBeGreaterThan(0));
  expect(screen.queryByText(/Score saved at the end of the last over/)).not.toBeInTheDocument();
  expect(screen.getByText(/LIVE/)).toBeInTheDocument();
});

test("a finished tournament match shows the final result", async () => {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ match: { ...savedMatch, status: "completed", resultText: "Tigers won by 12 runs" } }),
  });
  renderAt("TABC234");
  expect(await screen.findByText(/Final · Tigers won by 12 runs/)).toBeInTheDocument();
  await waitFor(() => expect(screen.getAllByText("42/1").length).toBeGreaterThan(0));
});

test("casual game codes don't call the tournament API", async () => {
  renderAt("ABC123");
  await act(async () => {
    await new Promise((r) => setTimeout(r, 50));
  });
  expect((global as any).fetch).not.toHaveBeenCalled();
  expect(screen.queryByText("Pune Premier League")).not.toBeInTheDocument();
});
