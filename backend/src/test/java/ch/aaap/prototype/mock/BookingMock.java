package ch.aaap.prototype.mock;

import ch.aaap.prototype.domain.Booking;
import ch.aaap.prototype.domain.WashProgramme;
import ch.aaap.prototype.dto.BookingResponse;
import ch.aaap.prototype.dto.CreateBookingRequest;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

/** Test fixtures for Booking: one place that builds entities and DTOs for tests. */
public final class BookingMock {

  public static final LocalDate DATE = LocalDate.parse("2026-03-17");
  public static final LocalTime TIME = LocalTime.parse("09:30");
  public static final String TIME_TEXT = "09:30";
  public static final Instant CREATED_AT = Instant.parse("2026-01-01T00:00:00Z");

  private BookingMock() {}

  public static Booking aBooking(String customerName) {
    return new Booking(WashProgramme.BASIC, DATE, TIME, customerName, "ZH 123456");
  }

  public static Booking aBooking(LocalDate date, LocalTime time) {
    return new Booking(WashProgramme.BASIC, date, time, "Anna Keller", "ZH 123456");
  }

  public static BookingResponse aResponse(UUID id, String customerName) {
    return new BookingResponse(
        id, WashProgramme.BASIC, DATE, TIME_TEXT, customerName, "ZH 123456", CREATED_AT);
  }

  public static CreateBookingRequest aCreateRequest(String customerName) {
    return new CreateBookingRequest(
        WashProgramme.BASIC, DATE, TIME_TEXT, customerName, " zh 123456 ");
  }
}
