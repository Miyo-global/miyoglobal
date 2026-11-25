import { expect, test } from "vitest";
import { preferredCall, SLOTS, workingDays } from "./slots";

test("slots run 10:00 to 17:40 in 20-minute steps", () => {
  expect(SLOTS[0]).toBe("10:00");
  expect(SLOTS.at(-1)).toBe("17:40");
  expect(SLOTS).toHaveLength(24);
});

test("working days skip weekends and start tomorrow", () => {
  // Friday 28 Nov 2025 → Mon 1 Dec … Fri 5 Dec.
  expect(workingDays(new Date(2025, 10, 28)).map((d) => d.label)).toEqual(["Mon 1 Dec", "Tue 2 Dec", "Wed 3 Dec", "Thu 4 Dec", "Fri 5 Dec"]);
});

test("preferred call line", () => {
  expect(preferredCall("Tue 2 Dec", "11:20", "IST")).toBe("Preferred call: Tue 2 Dec, 11:20 IST");
});
