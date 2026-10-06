// The API exchanges the appointment date as "YYYY-MM-DD"; on screen it reads "17.03.2026".
// Formatted from the parts, not through Date, so the day never shifts with the time zone.
export function formatAppointmentDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return year && month && day ? `${day}.${month}.${year}` : isoDate;
}
