const base_past_puzzles = {
  "2024-12-03": [
    "tgo",
    "bce",
    "riu",
    "vwh",
  ],
} as const satisfies Record<string, string[]>;

export const past_puzzles: {
  [K in keyof typeof base_past_puzzles]: readonly string[];
} = base_past_puzzles;
