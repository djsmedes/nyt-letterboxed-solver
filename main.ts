import { parseArgs } from "jsr:@std/cli/parse-args";

const letters: string[] = [
  "tgo",
  "bce",
  "riu",
  "vwh",
];

const WORDS_FILENAME = "wl-nocaps-nodubs.txt";

async function get_words(): Promise<string[]> {
  return (await Deno.readTextFile(WORDS_FILENAME)).split("\n");
}

async function solve(): Promise<string[][]> {
  const good_letters = new Set(letters.flatMap((side) => side.split("")));
  const bad_letters = "abcdefghijklmnopqrstuvwxyz".split("").filter((letter) =>
    !good_letters.has(letter)
  );
  const forbidden_bigrams = letters.flatMap((side) => {
    const result = [];
    for (let i = 0; i < side.length; i++) {
      for (let j = 0; j < side.length; j++) {
        if (i !== j) {
          result.push(side[i] + side[j]);
        }
      }
    }
    return result;
  });

  const possible_words = (await get_words()).filter((
    word,
  ) =>
    [...bad_letters, ...forbidden_bigrams].every((bad_char) =>
      !(word.includes(bad_char))
    )
  );
  const sorted_possible_words = possible_words.map((
    word,
  ) => ({ word, uniq: new Set(word.split("")).size })).toSorted((a, b) =>
    b.uniq - a.uniq
  ).map(({ word }) => word);

  const possible_combos = [];
  for (const first_word of sorted_possible_words) {
    const last_letter = first_word.charAt(first_word.length - 1);
    const possible_followups = sorted_possible_words.filter((word) =>
      word !== first_word && word.startsWith(last_letter)
    );
    for (const second_word of possible_followups) {
      if (
        new Set([...first_word.split(""), ...second_word.split("")]).size ===
          good_letters.size
      ) {
        possible_combos.push([first_word, second_word]);
      }
    }
  }
  return possible_combos.toSorted((a, b) =>
    a[0].length + a[1].length - (
      b[0].length + b[1].length
    )
  );
}

if (import.meta.main) {
  const possible_combos = await solve();

  const flags = parseArgs(Deno.args, {
    boolean: ["answer"],
    string: ["hint"],
    default: { hint: "", answer: false },
  });

  // HINT(ISH) - HOW HARD IS IT?
  if (flags.hint === "" && flags.answer === false) {
    const vocab_size = new Set(possible_combos.map(([w1, _w2]) => w1)).size;
    console.log(
      `Number of possible starting words allowing for 2-word completion: ${vocab_size}`,
    );
  }

  // HINT - WHAT SHOULD FIRST WORD START WITH?
  if (flags.hint.includes("1")) {
    const possible_first_letters = [
      ...new Set(
        possible_combos.map(([w1, _w2]) => w1.charAt(0)),
      ),
    ].toSorted();
    console.log(
      `First word can start with: ${possible_first_letters.join(", ")}`,
    );
  }

  // HINT - WHAT SHOULD SECOND WORD START WITH?
  if (flags.hint.includes("2")) {
    const possible_w2_first_letters = [
      ...new Set(
        possible_combos.map(([_w1, w2]) => w2.charAt(0)),
      ),
    ].toSorted();
    console.log(
      `Second word can start with: ${possible_w2_first_letters.join(", ")}`,
    );
  }

  // ANSWER
  if (flags.answer) {
    console.log(JSON.stringify(possible_combos, null, 2));
  }
}
