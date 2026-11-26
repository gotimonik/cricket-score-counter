import { compareVersions, pickPrompt } from "../AppUpdatePrompt";

jest.mock("@capacitor/app", () => ({ App: { getInfo: jest.fn(), addListener: jest.fn() } }));

const config = {
  android: { latestVersion: "1.1.38", minVersion: "1.1.30", storeUrl: "play" },
  ios: { latestVersion: "1.0.4", minVersion: "", storeUrl: "appstore" },
  message: "",
};

test("compares dotted versions numerically", () => {
  expect(compareVersions("1.1.9", "1.1.38")).toBe(-1);
  expect(compareVersions("1.1.38", "1.1.38")).toBe(0);
  expect(compareVersions("1.2", "1.1.38")).toBe(1);
  expect(compareVersions("1.0.4", "1.0.4.0")).toBe(0);
});

test("older than latest: optional update", () => {
  expect(pickPrompt(config, "android", "1.1.37")?.kind).toBe("available");
  expect(pickPrompt(config, "ios", "1.0.3")).toMatchObject({ kind: "available", storeUrl: "appstore" });
});

test("older than minimum: required update", () => {
  expect(pickPrompt(config, "android", "1.1.29")?.kind).toBe("required");
});

test("up to date, web, or prompt turned off: nothing", () => {
  expect(pickPrompt(config, "android", "1.1.38")).toBeNull();
  expect(pickPrompt(config, "web", "1.0.0")).toBeNull();
  expect(pickPrompt({ android: { latestVersion: "", minVersion: "", storeUrl: "" } }, "android", "1.0.0")).toBeNull();
});
