const NUMERALS: Array<[number, string]> = [
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export function toRoman(value: number): string {
  let n = value;
  let out = "";
  for (const [amount, glyph] of NUMERALS) {
    while (n >= amount) {
      out += glyph;
      n -= amount;
    }
  }
  return out;
}
