package ch.aaap.prototype.repository;

import static ch.aaap.prototype.mock.BookingMock.aBooking;
import static org.assertj.core.api.Assertions.assertThat;

import ch.aaap.prototype.domain.Booking;
import ch.aaap.prototype.support.PostgresContainer;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

/** Slice test: JPA against the real migrations on the shared Testcontainers Postgres. */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(PostgresContainer.class)
class BookingRepositoryTest {

  @Autowired private BookingRepository bookingRepository;

  @Test
  void storesTheAppointmentDateAndTime() {
    // given
    Booking saved =
        bookingRepository.save(aBooking(LocalDate.parse("2026-03-17"), LocalTime.parse("09:30")));

    // when
    Optional<Booking> found = bookingRepository.findById(saved.getId());

    // then
    assertThat(found).isPresent();
    assertThat(found.get().getAppointmentDate()).isEqualTo(LocalDate.parse("2026-03-17"));
    assertThat(found.get().getAppointmentTime()).isEqualTo(LocalTime.parse("09:30"));
    assertThat(found.get().getCustomerName()).isEqualTo("Anna Keller");
  }
}
