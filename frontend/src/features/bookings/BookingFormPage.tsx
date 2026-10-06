// The customer's booking form: wash programme, date, time, name and licence plate.
// useApiForm validates with the generated Zod schema before sending and puts the server's field
// errors on the fields. On success: confirm and go to the confirmation page.
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { getGetBookingQueryKey, useCreateBooking } from '@/api/generated/bookings/bookings';
import { CreateBookingBody } from '@/api/generated/bookings/bookings.zod';
import type { CreateBookingRequest } from '@/api/generated/model';
import { useApiForm } from '@/platform/forms/useApiForm';
import { Button, Form, Input, PageTitle, Select, useToast } from '@/ui';
import { WASH_PROGRAMME_OPTIONS } from './components/washProgramme';

const EMPTY: CreateBookingRequest = {
  washProgramme: 'BASIC',
  appointmentDate: '',
  appointmentTime: '',
  customerName: '',
  licencePlate: '',
};

export function BookingFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const form = useApiForm(CreateBookingBody, EMPTY);
  const { errors, isSubmitting } = form.formState;

  const create = useCreateBooking({
    mutation: {
      onSuccess: async (response) => {
        const bookingId = response.data.id;
        await queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(bookingId) });
        toast.show('Termin gebucht.');
        await navigate(`/bookings/${bookingId}`);
      },
      onError: form.handleServerError,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await create.mutateAsync({ data: values }).catch(() => undefined);
  });

  return (
    <section>
      <PageTitle>Waschtermin buchen</PageTitle>
      <Form
        label="Waschtermin buchen"
        onSubmit={(event) => void onSubmit(event)}
        error={form.formError}
        actions={
          <Button type="submit" disabled={isSubmitting}>
            Termin buchen
          </Button>
        }
      >
        <Select
          label="Waschprogramm"
          required
          options={WASH_PROGRAMME_OPTIONS}
          error={errors.washProgramme?.message}
          {...form.register('washProgramme')}
        />
        <Input
          label="Datum"
          type="date"
          required
          error={errors.appointmentDate?.message}
          {...form.register('appointmentDate')}
        />
        <Input
          label="Uhrzeit"
          type="time"
          required
          error={errors.appointmentTime?.message}
          {...form.register('appointmentTime')}
        />
        <Input
          label="Name"
          required
          error={errors.customerName?.message}
          {...form.register('customerName')}
        />
        <Input
          label="Kennzeichen"
          required
          helperText="Zum Beispiel ZH 123456"
          error={errors.licencePlate?.message}
          {...form.register('licencePlate')}
        />
      </Form>
    </section>
  );
}
