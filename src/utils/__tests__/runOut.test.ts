import { battersAfterRunOut } from "../runOut";

describe("battersAfterRunOut", () => {
  const base = { striker: "Asha", nonStriker: "Bina", incoming: "Chetan" };

  it("striker run out at the striker's end: new batter faces", () => {
    expect(battersAfterRunOut({ ...base, outBatsman: "Asha", end: "striker" })).toEqual({ striker: "Chetan", nonStriker: "Bina" });
  });

  it("striker run out at the non-striker's end (batters crossed): survivor faces", () => {
    expect(battersAfterRunOut({ ...base, outBatsman: "Asha", end: "non-striker" })).toEqual({ striker: "Bina", nonStriker: "Chetan" });
  });

  it("non-striker run out at the striker's end: new batter faces", () => {
    expect(battersAfterRunOut({ ...base, outBatsman: "Bina", end: "striker" })).toEqual({ striker: "Chetan", nonStriker: "Asha" });
  });

  it("non-striker run out backing up at the non-striker's end: striker keeps strike", () => {
    expect(battersAfterRunOut({ ...base, outBatsman: "Bina", end: "non-striker" })).toEqual({ striker: "Asha", nonStriker: "Chetan" });
  });

  it("no new batter (single-batter mode): survivor carries on alone", () => {
    expect(battersAfterRunOut({ ...base, incoming: undefined, outBatsman: "Asha", end: "striker" })).toEqual({ striker: "Bina", nonStriker: "" });
  });
});
