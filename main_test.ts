import { assertEquals } from "@std/assert";
import { solve } from "./main.ts";
import { past_puzzles } from "./past_puzzles.ts";

Deno.test(async function solveTest() {
  const letters = past_puzzles["2024-12-03"];
  assertEquals((await solve(letters)).length, 2);
});
