import { parseArgs } from "jsr:@std/cli/parse-args";

const WORDS_FILENAME = "wl.txt";

async function get_words(): Promise<string[]> {
  return (await Deno.readTextFile(WORDS_FILENAME)).split("\n");
}

async function get_possible_words(
  letters: readonly string[],
): Promise<string[]> {
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

  return (await get_words()).filter((
    word,
  ) =>
    [...bad_letters, ...forbidden_bigrams].every((bad_char) =>
      !(word.includes(bad_char))
    )
  );
}

export async function solve(letters: readonly string[]): Promise<string[][]> {
  const good_letters = new Set(letters.flatMap((side) => side.split("")));
  const sorted_possible_words = (await get_possible_words(letters)).map((
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

async function get_best_candidates(
  letters: readonly string[],
  n: number = 20,
  must_start?: string,
  must_end?: string,
  must_have?: string[],
): Promise<string[]> {
  let possible_words = await get_possible_words(letters);
  if (must_start) {
    possible_words = possible_words.filter((w) => w.startsWith(must_start));
  }
  if (must_end) {
    possible_words = possible_words.filter((w) => w.endsWith(must_end));
  }
  if (must_have) {
    const must_have_set = new Set(must_have);
    possible_words = possible_words.filter((w) =>
      must_have_set.difference(new Set(w.split(""))).size === 0
    );
  }
  possible_words.sort((a, b) =>
    new Set(b.split("")).size - new Set(a.split("")).size
  );
  return possible_words.slice(0, n);
}

async function checkword(word: string): Promise<boolean> {
  const all_words = await get_words();
  return all_words.includes(word);
}

if (import.meta.main) {
  const flags = parseArgs(Deno.args, {
    boolean: ["answer", "howhard", "candidates"],
    string: [
      "hint1",
      "hint2",
      "letters",
      "checkword",
      "n",
      "must-start",
      "must-end",
      "must-have",
    ],
    default: { hint1: "0", hint2: "0", answer: false, letters: "", n: "20" },
  });

  if (flags.checkword) {
    const is_in_vocab = await checkword(flags.checkword);
    console.log(`${flags.checkword} in vocab: ${is_in_vocab}`);
    Deno.exit();
  }

  const letters = flags.letters.split(",");

  if (flags.candidates) {
    const candidates = await get_best_candidates(
      letters,
      parseInt(flags.n),
      flags["must-start"],
      flags["must-end"],
      flags["must-have"]?.split(""),
    );
    console.log(JSON.stringify(candidates, null, 2));
    Deno.exit();
  }

  const possible_combos = await solve(letters);

  // HINT(ISH) - HOW HARD IS IT?
  if (flags.howhard) {
    const vocab_size = new Set(possible_combos.map(([w1, _w2]) => w1)).size;
    console.log(
      `Number of possible starting words allowing for 2-word completion: ${vocab_size}`,
    );
  }

  // HINT - WHAT SHOULD FIRST WORD START WITH?
  const hint1_letters = parseInt(flags.hint1);
  if (hint1_letters) {
    const possible_first_letters = [
      ...new Set(
        possible_combos.map(([w1, _w2]) => w1.slice(0, hint1_letters)),
      ),
    ].toSorted();
    console.log(
      `First word can start with: ${possible_first_letters.join(", ")}`,
    );
  }

  // HINT - WHAT SHOULD SECOND WORD START WITH?
  const hint2_letters = parseInt(flags.hint2);
  if (hint2_letters) {
    const possible_w2_first_letters = [
      ...new Set(
        possible_combos.map(([_w1, w2]) => w2.slice(0, hint2_letters)),
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
