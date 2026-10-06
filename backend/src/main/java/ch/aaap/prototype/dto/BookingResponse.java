package ch.aaap.prototype.dto;

import ch.aaap.prototype.domain.WashProgramme;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/**
 * One booking, detail view. Always a record, no Lombok. The time is a "HH:mm" string, the same
 * shape CreateBookingRequest takes.
 */
public record BookingResponse(
    UUID id,
    WashProgramme washProgramme,
    LocalDate appointmentDate,
    String appointmentTime,
    String customerName,
    String licencePlate,
    Instant createdAt) {}
