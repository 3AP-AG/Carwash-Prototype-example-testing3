package ch.aaap.prototype.mapper;

import ch.aaap.prototype.domain.Booking;
import ch.aaap.prototype.dto.BookingResponse;
import ch.aaap.prototype.dto.CreateBookingRequest;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/** Entity ↔ DTO for Booking, in one place. */
public final class BookingMapper {

  private static final DateTimeFormatter HOUR_MINUTE = DateTimeFormatter.ofPattern("HH:mm");

  private BookingMapper() {}

  public static BookingResponse toResponse(Booking booking) {
    return new BookingResponse(
        booking.getId(),
        booking.getWashProgramme(),
        booking.getAppointmentDate(),
        booking.getAppointmentTime().format(HOUR_MINUTE),
        booking.getCustomerName(),
        booking.getLicencePlate(),
        booking.getCreatedAt());
  }

  /** The request's "HH:mm" time is validated by @Pattern, so parsing it here cannot fail. */
  public static Booking fromCreate(CreateBookingRequest request) {
    return new Booking(
        request.washProgramme(),
        request.appointmentDate(),
        LocalTime.parse(request.appointmentTime()),
        request.customerName().strip(),
        request.licencePlate().strip().toUpperCase(Locale.ROOT));
  }
}
