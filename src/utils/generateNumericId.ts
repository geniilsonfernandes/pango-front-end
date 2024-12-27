export function generateNumericId(): number {
  const min = 100_000_000;
  const max = 999_999_999;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
