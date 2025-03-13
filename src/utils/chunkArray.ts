export function chunkArray<T>(array: T[], size: number): T[][] {
  return array.reduce(
    (acc, _, i) => (i % size === 0 ? [...acc, array.slice(i, i + size)] : acc),
    [] as T[][]
  );
}
