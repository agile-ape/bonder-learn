import assert from "node:assert/strict";
import { TraceEngine } from "./engine";
import { generateChoices } from "./choices";
import { LEVELS, TOTAL_LEVELS } from "./levels";
import { buildFullTrace } from "./trace";

console.log("trace-it engine tests\n");

test("every level builds a non-empty trace", () => {
  for (const level of LEVELS) {
    const trace = buildFullTrace(level);
    assert(trace.length >= 1, `level ${level.id} has empty trace`);
    assert.equal(trace[0].label, "start");
  }
});

test("level 0 trace", () => {
  const trace = buildFullTrace(LEVELS[0]);
  assert.equal(trace.length, 2);
  assert.equal(trace[0].vars.y, null);
  assert.equal(trace[1].vars.y, 5);
});

test("level 1 trace", () => {
  const trace = buildFullTrace(LEVELS[1]);
  assert.equal(trace.length, 4);
  assert.equal(trace[3].vars.y, 4);
});

test("level 5 nine-laps final row", () => {
  const trace = buildFullTrace(LEVELS[5]);
  const last = trace[trace.length - 1];
  assert.equal(last.label, "done");
  assert.equal(last.vars.i, 10);
  assert.equal(last.vars.y, 11);
  assert.equal(last.condition?.result, false);
  assert.equal(trace.filter((r) => r.label.startsWith("loop")).length, 9);
});

test("level 6 never runs", () => {
  const trace = buildFullTrace(LEVELS[6]);
  const loops = trace.filter((r) => r.label.startsWith("loop"));
  assert.equal(loops.length, 0);
  const done = trace.find((r) => r.label === "done");
  assert.ok(done);
  assert.equal(done!.condition?.result, false);
});

test("level 10 runs one more lap than level 9", () => {
  const loops9 = buildFullTrace(LEVELS[9]).filter((r) => r.label.startsWith("loop")).length;
  const loops10 = buildFullTrace(LEVELS[10]).filter((r) => r.label.startsWith("loop")).length;
  assert.equal(loops10, loops9 + 1);
});

test("TraceEngine watch mode steps through all rows", () => {
  const level = LEVELS[1];
  const engine = new TraceEngine(level);
  assert.equal(engine.committed.length, 1);
  while (!engine.done) {
    engine.step();
  }
  assert.equal(engine.committed.length, buildFullTrace(level).length);
});

test("TraceEngine predict mode accepts correct pick", () => {
  const level = LEVELS[2];
  const engine = new TraceEngine(level);
  const full = buildFullTrace(level);
  let picks = 0;
  while (!engine.done) {
    const pending = engine.getPendingRow();
    assert.ok(pending);
    const result = engine.submitPick(pending);
    assert.notEqual(result, "wrong");
    picks += 1;
  }
  assert.equal(picks, full.length - 1);
});

test("generateChoices includes correct answer", () => {
  const level = LEVELS[5];
  const pending = buildFullTrace(level)[3];
  const choices = generateChoices(pending, level);
  assert.ok(choices.length >= 3);
  const match = choices.some(
    (c) =>
      c.label === pending.label &&
      c.vars.i === pending.vars.i &&
      c.vars.y === pending.vars.y &&
      c.condition?.result === pending.condition?.result
  );
  assert.ok(match);
});

test("TOTAL_LEVELS matches LEVELS length", () => {
  assert.equal(TOTAL_LEVELS, LEVELS.length);
});

console.log("\nAll trace-it tests passed.");

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}
