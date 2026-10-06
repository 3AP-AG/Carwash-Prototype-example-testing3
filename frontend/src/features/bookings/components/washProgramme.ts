// Display labels for the wash programmes, in one place for the form and the confirmation.
import type { BookingResponseWashProgramme } from '@/api/generated/model';

export const WASH_PROGRAMME_LABELS: Record<BookingResponseWashProgramme, string> = {
  BASIC: 'Basiswäsche',
  COMFORT: 'Komfortwäsche',
  PREMIUM: 'Premiumwäsche',
};

export const WASH_PROGRAMME_OPTIONS = Object.entries(WASH_PROGRAMME_LABELS).map(([value, label]) => ({
  value,
  label,
}));
