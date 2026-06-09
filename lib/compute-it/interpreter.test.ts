import assert from "node:assert/strict";
import { assertSquareLevel } from "./gridUtils";
import { getGoalPosition } from "./goal";
import { GameEngine, isInBounds } from "./interpreter";
import { LEVELS, TOTAL_LEVELS, getLevel } from "./levels";
import { move, nextId, resetIdCounter } from "./types";
import type { ComputeItLevel, Stmt } from "./types";

function runLevel(level: ComputeItLevel) {
  const engine = new GameEngine(level);
  return engine.simulateAllMoves();
}

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (err) {
    console.error(`✗ ${name}`);
    throw err;
  }
}

test("TOTAL_LEVELS is 22", () => {
  assert.equal(TOTAL_LEVELS, 22);
  assert.equal(LEVELS.length, 22);
});

test("all levels use square grids", () => {
  for (const level of LEVELS) {
    assertSquareLevel(level);
    assert.equal(level.map.length, level.map[0]?.length);
  }
});

test("getGoalPosition returns in-bounds coords for every level", () => {
  for (const level of LEVELS) {
    const goal = getGoalPosition(level);
    const size = level.map.length;
    assert.ok(goal.x >= 0 && goal.x < size, `level ${level.id} goal x`);
    assert.ok(goal.y >= 0 && goal.y < size, `level ${level.id} goal y`);
  }
});

test("level 0 goal is top-right corner", () => {
  const level = getLevel(0)!;
  assert.deepEqual(getGoalPosition(level), { x: 2, y: 0 });
});

test("level 0 produces two right moves", () => {
  const level = getLevel(0)!;
  assert.equal(level.map.length, 3);
  assert.deepEqual(runLevel(level), ["right", "right"]);
});

test("level 1 stays in bounds with four moves", () => {
  const level = getLevel(1)!;
  assert.deepEqual(runLevel(level), ["up", "right", "up", "right"]);
  assert.deepEqual(getGoalPosition(level), { x: 2, y: 0 });
});

test("level 2 code-beats-visual path", () => {
  const level = getLevel(2)!;
  assert.deepEqual(runLevel(level), ["up", "right", "up"]);
});

test("level 3 go-down", () => {
  const level = getLevel(3)!;
  assert.deepEqual(runLevel(level), ["down", "down", "right"]);
  assert.deepEqual(getGoalPosition(level), { x: 1, y: 2 });
});

test("level 5 full-compass uses all four directions", () => {
  const level = getLevel(5)!;
  const moves = runLevel(level);
  assert.ok(moves.includes("up"));
  assert.ok(moves.includes("down"));
  assert.ok(moves.includes("left"));
  assert.ok(moves.includes("right"));
});

test("repeat expands correctly", () => {
  resetIdCounter();
  const level: ComputeItLevel = {
    id: 99,
    slug: "test-repeat",
    title: "test",
    map: [
      ["normal", "normal", "normal"],
      ["normal", "normal", "normal"],
      ["normal", "normal", "normal"],
    ],
    start: { x: 0, y: 0 },
    program: [
      {
        type: "repeat",
        count: 2,
        body: [move("right")],
        id: nextId("repeat"),
      },
    ],
  };
  assert.deepEqual(runLevel(level), ["right", "right"]);
});

test("if skips body when color false", () => {
  resetIdCounter();
  const level: ComputeItLevel = {
    id: 98,
    slug: "test-if-false",
    title: "test",
    map: [
      ["normal", "normal"],
      ["normal", "normal"],
    ],
    start: { x: 0, y: 0 },
    program: [
      move("right"),
      {
        type: "if",
        color: "orange",
        then: [move("up")],
        id: nextId("if"),
      },
    ],
  };
  assert.deepEqual(runLevel(level), ["right"]);
});

test("if runs body when color true", () => {
  resetIdCounter();
  const level: ComputeItLevel = {
    id: 97,
    slug: "test-if-true",
    title: "test",
    map: [
      ["orange", "normal", "normal"],
      ["normal", "normal", "normal"],
      ["normal", "normal", "normal"],
    ],
    start: { x: 0, y: 0 },
    program: [
      {
        type: "if",
        color: "orange",
        then: [move("right")],
        id: nextId("if"),
      },
    ],
  };
  assert.deepEqual(runLevel(level), ["right"]);
});

test("if not runs body when color false", () => {
  resetIdCounter();
  const level: ComputeItLevel = {
    id: 96,
    slug: "test-if-not",
    title: "test",
    map: [
      ["red", "normal", "normal"],
      ["normal", "normal", "normal"],
      ["normal", "normal", "normal"],
    ],
    start: { x: 0, y: 0 },
    program: [
      {
        type: "if",
        color: "red",
        negated: true,
        then: [move("right")],
        id: nextId("if"),
      },
    ],
  };
  assert.deepEqual(runLevel(level), []);
});

test("if not runs body when standing on non-matching color", () => {
  resetIdCounter();
  const level: ComputeItLevel = {
    id: 95,
    slug: "test-if-not-run",
    title: "test",
    map: [
      ["red", "normal", "normal"],
      ["normal", "normal", "normal"],
      ["normal", "normal", "normal"],
    ],
    start: { x: 0, y: 0 },
    program: [
      move("right"),
      {
        type: "if",
        color: "red",
        negated: true,
        then: [move("down")],
        id: nextId("if"),
      },
    ],
  };
  assert.deepEqual(runLevel(level), ["right", "down"]);
});

test("level 8 not-color skips down on red", () => {
  const level = getLevel(8)!;
  assert.deepEqual(runLevel(level), ["right", "right", "down"]);
  assert.deepEqual(getGoalPosition(level), { x: 2, y: 2 });
});

test("while loops until color changes", () => {
  const level = getLevel(10)!;
  const moves = runLevel(level);
  assert.equal(moves.filter((m) => m === "right").length, 3);
  assert.equal(moves[moves.length - 1], "up");
  assert.deepEqual(getGoalPosition(level), { x: 3, y: 2 });
});

test("nested repeat order", () => {
  const level = getLevel(15)!;
  assert.equal(level.map.length, 5);
  assert.deepEqual(runLevel(level), [
    "right",
    "right",
    "down",
    "right",
    "right",
    "down",
  ]);
});

test("function call resolves hoisted definition", () => {
  const level = getLevel(21)!;
  assert.deepEqual(runLevel(level), ["right", "right", "right", "right"]);
});

test("conditional repeat in level 16", () => {
  const level = getLevel(16)!;
  const moves = runLevel(level);
  assert.ok(moves.includes("down"));
  assert.equal(moves.filter((m) => m === "right").length, 4);
});

test("level 20 two-functions", () => {
  const level = getLevel(20)!;
  assert.deepEqual(runLevel(level), ["right", "right", "down", "down"]);
  assert.deepEqual(getGoalPosition(level), { x: 2, y: 2 });
});

test("wrong move returns wrong without completing", () => {
  const level = getLevel(0)!;
  const engine = new GameEngine(level);
  assert.equal(engine.submitMove("left"), "wrong");
  assert.equal(engine.finished, false);
});

test("out-of-bounds move returns wrong", () => {
  resetIdCounter();
  const level: ComputeItLevel = {
    id: 94,
    slug: "test-oob",
    title: "test",
    map: [
      ["normal", "normal", "normal"],
      ["normal", "normal", "normal"],
      ["normal", "normal", "normal"],
    ],
    start: { x: 2, y: 0 },
    program: [move("right")],
  };
  const engine = new GameEngine(level);
  assert.equal(engine.submitMove("right"), "wrong");
  assert.equal(engine.finished, false);
});

test("all levels stay in bounds during simulation", () => {
  for (const level of LEVELS) {
    const engine = new GameEngine(level);
    const size = level.map.length;
    while (!engine.finished) {
      const next = engine.peekMove();
      if (!next) break;
      engine.submitMove(next);
      const pos = engine.getPosition();
      assert.ok(
        isInBounds(pos, level.map),
        `level ${level.id} ended at (${pos.x},${pos.y}) out of ${size}×${size} bounds`
      );
    }
  }
});

test("all levels simulate without stalling", () => {
  for (const level of LEVELS) {
    const engine = new GameEngine(level);
    const moves = engine.simulateAllMoves();
    assert.ok(moves.length > 0, `level ${level.id} should have moves`);
    assert.equal(engine.finished, true, `level ${level.id} should finish`);
  }
});

console.log("\nAll compute-it tests passed.");
