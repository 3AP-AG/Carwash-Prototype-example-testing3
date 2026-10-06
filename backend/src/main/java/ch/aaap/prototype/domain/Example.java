package ch.aaap.prototype.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

// Reference entity (JPA). Never leaves the service layer; controllers return DTOs.
// Lombok: @Getter + @NoArgsConstructor(access = PROTECTED) only; never @Data, @Setter,
// @EqualsAndHashCode. State changes go through named methods (update), not setters.
@Entity
@Table(name = "example")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Example {

  @Id private UUID id;

  @Column(nullable = false)
  private String title;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ExampleStatus status;

  @Column(nullable = false)
  private String description;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  public Example(String title, ExampleStatus status, String description) {
    this.id = UUID.randomUUID();
    this.title = title;
    this.status = status;
    this.description = description;
    this.createdAt = Instant.now();
    this.updatedAt = this.createdAt;
  }

  public void update(String title, ExampleStatus status, String description) {
    this.title = title;
    this.status = status;
    this.description = description;
    this.updatedAt = Instant.now();
  }
}
