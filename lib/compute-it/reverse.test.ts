import assert from "node:assert/strict";
import { getExpectedMoves, getReverseLevel, TOTAL_REVERSE_LEVELS } from "./reverse";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (err) {
    console.error(`✗ ${name}`);
    throw err;
  }
}

test("TOTAL_REVERSE_LEVELS is 1", () => {
  assert.equal(TOTAL_REVERSE_LEVELS, 1);
});

test("reverse level 0 maps to forward level 0", () => {
  const level = getReverseLevel(0);
  assert.ok(level);
  assert.equal(level!.id, 0);
  assert.equal(level!.slug, "first-steps");
});

test("getExpectedMoves for level 0 is two rights", () => {
  assert.deepEqual(getExpectedMoves(0), ["right", "right"]);
});

console.log("\nAll compute-it reverse tests passed.");
