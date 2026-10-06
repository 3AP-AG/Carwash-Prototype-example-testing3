package ch.aaap.prototype.domain;

// Reference entity (JPA). Never leaves the service layer; controllers return DTOs.
// Lombok: @Getter + @NoArgsConstructor(access = PROTECTED) only; never @Data, @Setter, @EqualsAndHashCode.
// TODO(b): fields id (UUID), title, status, description, createdAt, updatedAt; table from V4__example.sql.
public class Example {}
