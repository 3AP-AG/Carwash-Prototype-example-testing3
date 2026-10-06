package ch.aaap.prototype.dto;

import ch.aaap.prototype.domain.WashProgramme;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/**
 * The booking form. Always a record, no Lombok. The Bean Validation annotations become the
 * generated Zod schema, so the frontend validates the same rules before sending; the messages are
 * the ones the client reads, so they are in the prototype's UI language.
 *
 * <p>The time is a "HH:mm" string, not a LocalTime: that is what the generated schema can validate
 * and what the time field in the browser sends, so an empty time is a field error like any other.
 */
public record CreateBookingRequest(
    @NotNull(message = "Bitte ein Waschprogramm wählen.") WashProgramme washProgramme,
    @NotNull(message = "Bitte ein Datum wählen.") LocalDate appointmentDate,
    @NotBlank(message = "Bitte eine Uhrzeit wählen.")
        @Pattern(regexp = "^([01]\\d|2[0-3]):[0-5]\\d$", message = "Bitte eine Uhrzeit wählen.")
        String appointmentTime,
    @NotBlank(message = "Bitte den Namen angeben.")
        @Size(min = 1, max = 100, message = "Der Name ist zu lang.")
        String customerName,
    @NotBlank(message = "Bitte das Kennzeichen angeben.")
        @Size(min = 1, max = 15, message = "Das Kennzeichen ist zu lang.")
        String licencePlate) {}
