package ch.aaap.prototype.dto;

import ch.aaap.prototype.domain.ExampleStatus;
import java.time.Instant;
import java.util.UUID;

/** Reference DTO: detail view. Always a record, no Lombok. */
public record ExampleResponse(
    UUID id,
    String title,
    ExampleStatus status,
    String description,
    Instant createdAt,
    Instant updatedAt) {}
