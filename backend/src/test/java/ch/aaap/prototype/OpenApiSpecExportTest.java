package ch.aaap.prototype;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.aaap.prototype.support.PostgresContainer;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Writes the OpenAPI spec generated from the code to api/openapi.yaml. Runs only from {@code make
 * generate} (-Dopenapi.export=true), so a normal test run never changes tracked files.
 */
@SpringBootTest(properties = "springdoc.api-docs.enabled=true")
@AutoConfigureMockMvc
@Import(PostgresContainer.class)
@EnabledIfSystemProperty(named = "openapi.export", matches = "true")
class OpenApiSpecExportTest {

  private static final Path SPEC = Path.of("..", "api", "openapi.yaml");

  @Autowired private MockMvc mvc;

  @Test
  @WithMockUser
  void exportSpec() throws Exception {
    String yaml =
        mvc.perform(get("/v3/api-docs.yaml"))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString(StandardCharsets.UTF_8);
    Files.writeString(SPEC, yaml.endsWith("\n") ? yaml : yaml + "\n");
  }
}
