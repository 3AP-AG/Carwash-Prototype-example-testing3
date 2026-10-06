package ch.aaap.prototype.controller;

import static ch.aaap.prototype.mock.BookingMock.aResponse;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.aaap.prototype.dto.CreateBookingRequest;
import ch.aaap.prototype.platform.error.NotFoundException;
import ch.aaap.prototype.service.BookingService;
import java.util.UUID;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

/** Slice test: HTTP mapping and error shape. Protection is tested in platform/. */
@WebMvcTest(BookingController.class)
@WithMockUser
class BookingControllerTest {

  private static final UUID ID = UUID.fromString("00000000-0000-0000-0000-0000000000b1");

  @Autowired private MockMvc mvc;

  @MockitoBean private BookingService bookingService;

  @Nested
  class CreateBooking {

    @Test
    void returns201WithTheCreatedBooking() throws Exception {
      // given
      when(bookingService.create(any(CreateBookingRequest.class)))
          .thenReturn(aResponse(ID, "Anna Keller"));

      // when / then
      mvc.perform(
              post("/api/bookings")
                  .with(csrf())
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(
                      """
                      {"washProgramme": "BASIC", "appointmentDate": "2026-03-17", \
                      "appointmentTime": "09:30", "customerName": "Anna Keller", \
                      "licencePlate": "ZH 123456"}\
                      """))
          .andExpect(status().isCreated())
          .andExpect(jsonPath("$.id").value(ID.toString()))
          .andExpect(jsonPath("$.washProgramme").value("BASIC"))
          .andExpect(jsonPath("$.appointmentDate").value("2026-03-17"))
          .andExpect(jsonPath("$.appointmentTime").value("09:30"));
    }

    @Test
    void aBlankCustomerNameIsAFieldError() throws Exception {
      // when / then
      mvc.perform(
              post("/api/bookings")
                  .with(csrf())
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(
                      """
                      {"washProgramme": "BASIC", "appointmentDate": "2026-03-17", \
                      "appointmentTime": "09:30", "customerName": " ", \
                      "licencePlate": "ZH 123456"}\
                      """))
          .andExpect(status().isBadRequest())
          .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
          .andExpect(jsonPath("$.errors[0].field").value("customerName"));
      verifyNoInteractions(bookingService);
    }

    @Test
    void aBlankAppointmentTimeIsAFieldError() throws Exception {
      // when / then
      mvc.perform(
              post("/api/bookings")
                  .with(csrf())
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(
                      """
                      {"washProgramme": "BASIC", "appointmentDate": "2026-03-17", \
                      "appointmentTime": "", "customerName": "Anna Keller", \
                      "licencePlate": "ZH 123456"}\
                      """))
          .andExpect(status().isBadRequest())
          .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
          .andExpect(jsonPath("$.errors[0].field").value("appointmentTime"));
      verifyNoInteractions(bookingService);
    }

    @Test
    void aMissingAppointmentDateIsAFieldError() throws Exception {
      // when / then
      mvc.perform(
              post("/api/bookings")
                  .with(csrf())
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(
                      """
                      {"washProgramme": "BASIC", "appointmentDate": null, \
                      "appointmentTime": "09:30", "customerName": "Anna Keller", \
                      "licencePlate": "ZH 123456"}\
                      """))
          .andExpect(status().isBadRequest())
          .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
          .andExpect(jsonPath("$.errors[0].field").value("appointmentDate"));
      verifyNoInteractions(bookingService);
    }
  }

  @Nested
  class GetBooking {

    @Test
    void returnsTheBooking() throws Exception {
      // given
      when(bookingService.get(ID)).thenReturn(aResponse(ID, "Anna Keller"));

      // when / then
      mvc.perform(get("/api/bookings/{id}", ID))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.customerName").value("Anna Keller"))
          .andExpect(jsonPath("$.licencePlate").value("ZH 123456"));
    }

    @Test
    void unknownIdIsANotFoundProblem() throws Exception {
      // given
      when(bookingService.get(ID)).thenThrow(new NotFoundException("Booking does not exist."));

      // when / then
      mvc.perform(get("/api/bookings/{id}", ID))
          .andExpect(status().isNotFound())
          .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
          .andExpect(jsonPath("$.detail").value("Booking does not exist."));
    }
  }
}
