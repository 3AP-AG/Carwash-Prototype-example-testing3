// What the customer sees after booking: the appointment as it was saved. A 404 from the API
// becomes "does not exist", anything else the generic error state.
import { useParams } from 'react-router';
import { ApiError } from '@/api/client';
import { useGetBooking } from '@/api/generated/bookings/bookings';
import { Button, Card, CardField, ErrorState, LoadingState, PageTitle } from '@/ui';
import { formatAppointmentDate } from './components/appointment';
import { WASH_PROGRAMME_LABELS } from './components/washProgramme';

export function BookingConfirmationPage() {
  const { id = '' } = useParams();
  const { data, isPending, isError, error } = useGetBooking(id);

  if (isPending) {
    return <LoadingState label="Wird geladen…" />;
  }
  if (isError) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <section>
        <ErrorState
          message={notFound ? 'Dieser Termin existiert nicht.' : 'Der Termin konnte nicht geladen werden.'}
        />
        <Button variant="text" to="/bookings/new">
          Neuen Termin buchen
        </Button>
      </section>
    );
  }

  const booking = data.data;
  return (
    <section>
      <PageTitle>Ihr Termin ist gebucht</PageTitle>
      <Card>
        <CardField label="Waschprogramm">{WASH_PROGRAMME_LABELS[booking.washProgramme]}</CardField>
        <CardField label="Datum">{formatAppointmentDate(booking.appointmentDate)}</CardField>
        <CardField label="Uhrzeit">{booking.appointmentTime} Uhr</CardField>
        <CardField label="Name">{booking.customerName}</CardField>
        <CardField label="Kennzeichen">{booking.licencePlate}</CardField>
      </Card>
      <Button variant="text" to="/bookings/new">
        Weiteren Termin buchen
      </Button>
    </section>
  );
}
