import { assertEquals } from "@std/assert";
import { solve } from "./main.ts";

Deno.test(async function solveTest() {
  assertEquals((await solve(["tgo,bce,riu,nwh"])).length, 9);
});
