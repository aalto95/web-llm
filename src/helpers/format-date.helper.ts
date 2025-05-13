export function formatDate(date: string): string | undefined {
  if (date) {
    const formattedDate = new Date(date);
    const pad = (n: number): string => n.toString().padStart(2, '0');

    const day = pad(formattedDate.getDate());
    const month = pad(formattedDate.getMonth() + 1); // Months are zero-based
    const year = formattedDate.getFullYear();

    const hours = pad(formattedDate.getHours());
    const minutes = pad(formattedDate.getMinutes());

    return `${day}:${month}:${year} ${hours}:${minutes}`;
  }
}
