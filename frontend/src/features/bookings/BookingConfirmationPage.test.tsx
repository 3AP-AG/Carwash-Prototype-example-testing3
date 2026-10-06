import { screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { getGetBookingMockHandler, getGetBookingResponseMock } from '@/api/generated/bookings/bookings.msw';
import { renderWithProviders, server } from '@/test/setup';
import { BookingConfirmationPage } from './BookingConfirmationPage';

const ID = '00000000-0000-0000-0000-0000000000b1';

function renderPage() {
  renderWithProviders(
    <Routes>
      <Route path="/bookings/:id" element={<BookingConfirmationPage />} />
    </Routes>,
    { route: `/bookings/${ID}` },
  );
}

describe('BookingConfirmationPage', () => {
  it('shows the wash programme, the date and the time', async () => {
    server.use(
      getGetBookingMockHandler(
        getGetBookingResponseMock({
          id: ID,
          washProgramme: 'PREMIUM',
          appointmentDate: '2026-03-17',
          appointmentTime: '09:30',
          customerName: 'Anna Keller',
          licencePlate: 'ZH 123456',
        }),
      ),
    );
    renderPage();

    expect(await screen.findByText('Premiumwäsche')).toBeInTheDocument();
    expect(screen.getByText('17.03.2026')).toBeInTheDocument();
    expect(screen.getByText('09:30 Uhr')).toBeInTheDocument();
    expect(screen.getByText('Anna Keller')).toBeInTheDocument();
    expect(screen.getByText('ZH 123456')).toBeInTheDocument();
  });

  it('says so when the booking does not exist', async () => {
    server.use(
      http.get('*/api/bookings/*', () =>
        HttpResponse.json({ status: 404, detail: 'Booking does not exist.' }, { status: 404 }),
      ),
    );
    renderPage();

    expect(await screen.findByText('Dieser Termin existiert nicht.')).toBeInTheDocument();
  });
});
