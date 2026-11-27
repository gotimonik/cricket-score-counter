import { keepLiveMatchOrder } from "../liveMatchOrder";

const m = (code: string, runs = 0) => ({ code, runs });

describe("keepLiveMatchOrder", () => {
  it("uses the server order the first time", () => {
    expect(keepLiveMatchOrder(null, [m("a"), m("b")]).map((x) => x.code)).toEqual(["a", "b"]);
  });

  it("keeps positions when scores change, even if the server reorders", () => {
    const prev = [m("a", 10), m("b", 20), m("c", 30)];
    const next = [m("c", 34), m("a", 11), m("b", 20)];
    const out = keepLiveMatchOrder(prev, next);
    expect(out.map((x) => x.code)).toEqual(["a", "b", "c"]);
    expect(out.map((x) => x.runs)).toEqual([11, 20, 34]);
  });

  it("puts new matches on top and drops finished ones", () => {
    const out = keepLiveMatchOrder([m("a"), m("b"), m("c")], [m("d"), m("a"), m("c")]);
    expect(out.map((x) => x.code)).toEqual(["d", "a", "c"]);
  });
});
