package ch.aaap.prototype.platform.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

/**
 * The session cookie, set explicitly so it is the same under every servlet container and in tests.
 * Spring Boot 4 no longer applies server.servlet.session.cookie.* to Spring Session's cookie.
 * Secure is always on: browsers accept Secure cookies on http://localhost, so the local profile
 * still works.
 */
@Configuration
public class SessionCookieConfig {

  @Bean
  CookieSerializer cookieSerializer() {
    DefaultCookieSerializer serializer = new DefaultCookieSerializer();
    serializer.setCookieName("SESSION");
    serializer.setUseHttpOnlyCookie(true);
    serializer.setUseSecureCookie(true);
    serializer.setSameSite("Strict");
    serializer.setCookiePath("/");
    return serializer;
  }
}
