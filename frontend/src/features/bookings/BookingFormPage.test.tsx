import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import {
  getCreateBookingMockHandler,
  getCreateBookingResponseMock,
} from '@/api/generated/bookings/bookings.msw';
import { renderWithProviders, server } from '@/test/setup';
import { BookingFormPage } from './BookingFormPage';

const ID = '00000000-0000-0000-0000-0000000000b1';

function renderForm() {
  renderWithProviders(
    <Routes>
      <Route path="/bookings/new" element={<BookingFormPage />} />
      <Route path="/bookings/:id" element={<p>Confirmation page</p>} />
    </Routes>,
    { route: '/bookings/new' },
  );
}

async function fillIn(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(screen.getByLabelText(/Waschprogramm/), 'PREMIUM');
  await user.type(screen.getByLabelText(/Datum/), '2026-03-17');
  await user.type(screen.getByLabelText(/Uhrzeit/), '09:30');
  await user.type(screen.getByLabelText(/Name/), 'Anna Keller');
  await user.type(screen.getByLabelText(/Kennzeichen/), 'ZH 123456');
}

describe('BookingFormPage', () => {
  it('books the appointment and goes to the confirmation', async () => {
    let sent: unknown;
    server.use(
      getCreateBookingMockHandler(async ({ request }) => {
        sent = await request.json();
        return getCreateBookingResponseMock({ id: ID });
      }),
    );
    const user = userEvent.setup();
    renderForm();

    await fillIn(user);
    await user.click(screen.getByRole('button', { name: 'Termin buchen' }));

    expect(await screen.findByText('Confirmation page')).toBeInTheDocument();
    expect(screen.getByText('Termin gebucht.')).toBeInTheDocument();
    expect(sent).toEqual({
      washProgramme: 'PREMIUM',
      appointmentDate: '2026-03-17',
      appointmentTime: '09:30',
      customerName: 'Anna Keller',
      licencePlate: 'ZH 123456',
    });
  });

  it('offers the three wash programmes', () => {
    renderForm();

    expect(screen.getByRole('option', { name: 'Basiswäsche' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Komfortwäsche' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Premiumwäsche' })).toBeInTheDocument();
  });

  it('marks the empty date and time without sending anything', async () => {
    // No handler for POST: if the form sent a request, the test would fail on it.
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/Name/), 'Anna Keller');
    await user.type(screen.getByLabelText(/Kennzeichen/), 'ZH 123456');
    await user.click(screen.getByRole('button', { name: 'Termin buchen' }));

    expect(await screen.findByLabelText(/Datum/)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(/Uhrzeit/)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getAllByText('Bitte ausfüllen.')).toHaveLength(2);
    expect(screen.queryByText('Confirmation page')).not.toBeInTheDocument();
  });

  it('shows the server field errors on the fields', async () => {
    server.use(
      http.post('*/api/bookings', () =>
        HttpResponse.json(
          {
            status: 400,
            title: 'Bad Request',
            errors: [{ field: 'customerName', message: 'Bitte den Namen angeben.' }],
          },
          { status: 400 },
        ),
      ),
    );
    const user = userEvent.setup();
    renderForm();

    await fillIn(user);
    await user.click(screen.getByRole('button', { name: 'Termin buchen' }));

    expect(await screen.findByText('Bitte den Namen angeben.')).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/)).toHaveAttribute('aria-invalid', 'true');
  });
});
