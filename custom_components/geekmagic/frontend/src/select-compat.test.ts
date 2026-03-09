import { describe, it, expect } from "vitest";
import {
  resolveSelectedValue,
  buildSelectOptions,
  buildSelectOptionsWithEmpty,
} from "./select-compat";

describe("resolveSelectedValue", () => {
  const keys = ["classic", "dark", "neon"];

  describe("new HA format (2026.3+) — value-based", () => {
    it("returns the value directly", () => {
      expect(resolveSelectedValue({ value: "dark" }, keys)).toBe("dark");
    });

    it("handles empty string value (e.g. '-- Empty --' option)", () => {
      expect(resolveSelectedValue({ value: "" }, keys)).toBe("");
    });

    it("returns value even if it is not in the keys array", () => {
      expect(resolveSelectedValue({ value: "unknown" }, keys)).toBe("unknown");
    });

    it("prefers value over index when both are present", () => {
      expect(
        resolveSelectedValue({ value: "neon", index: 0 }, keys)
      ).toBe("neon");
    });
  });

  describe("old HA format (pre-2026.3) — index-based", () => {
    it("resolves index 0 to first key", () => {
      expect(resolveSelectedValue({ index: 0 }, keys)).toBe("classic");
    });

    it("resolves index 1 to second key", () => {
      expect(resolveSelectedValue({ index: 1 }, keys)).toBe("dark");
    });

    it("resolves last index", () => {
      expect(resolveSelectedValue({ index: 2 }, keys)).toBe("neon");
    });

    it("returns undefined for out-of-bounds index", () => {
      expect(resolveSelectedValue({ index: 5 }, keys)).toBeUndefined();
    });

    it("returns undefined for negative index", () => {
      expect(resolveSelectedValue({ index: -1 }, keys)).toBeUndefined();
    });
  });

  describe("edge cases", () => {
    it("returns undefined when detail has neither value nor index", () => {
      expect(resolveSelectedValue({}, keys)).toBeUndefined();
    });

    it("returns undefined for empty keys with index", () => {
      expect(resolveSelectedValue({ index: 0 }, [])).toBeUndefined();
    });

    it("handles undefined value and valid index", () => {
      expect(
        resolveSelectedValue({ value: undefined, index: 1 }, keys)
      ).toBe("dark");
    });

    it("handles null value and valid index", () => {
      expect(
        resolveSelectedValue(
          { value: null as unknown as string, index: 1 },
          keys
        )
      ).toBe("dark");
    });
  });
});

describe("buildSelectOptions", () => {
  it("converts a record to options array", () => {
    const entries = { classic: "Classic", dark: "Dark Mode", neon: "Neon" };
    expect(buildSelectOptions(entries)).toEqual([
      { value: "classic", label: "Classic" },
      { value: "dark", label: "Dark Mode" },
      { value: "neon", label: "Neon" },
    ]);
  });

  it("returns empty array for empty record", () => {
    expect(buildSelectOptions({})).toEqual([]);
  });

  it("preserves insertion order", () => {
    const entries = { z: "Zebra", a: "Apple", m: "Mango" };
    const result = buildSelectOptions(entries);
    expect(result.map((o) => o.value)).toEqual(["z", "a", "m"]);
  });
});

describe("buildSelectOptionsWithEmpty", () => {
  it("prepends empty option", () => {
    const entries = { clock: "Clock", entity: "Entity" };
    const result = buildSelectOptionsWithEmpty("-- Empty --", entries);
    expect(result).toEqual([
      { value: "", label: "-- Empty --" },
      { value: "clock", label: "Clock" },
      { value: "entity", label: "Entity" },
    ]);
  });

  it("returns only empty option for empty record", () => {
    const result = buildSelectOptionsWithEmpty("None", {});
    expect(result).toEqual([{ value: "", label: "None" }]);
  });
});
