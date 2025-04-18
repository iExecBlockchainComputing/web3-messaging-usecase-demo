export function formatTimestamp(timestamp: string | number): string {
  const date = new Date(Number(timestamp) * 1000);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
