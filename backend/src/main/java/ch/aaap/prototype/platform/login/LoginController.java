package ch.aaap.prototype.platform.login;

import ch.aaap.prototype.platform.security.SecurityConfig;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.util.HtmlUtils;

/**
 * The login page. Server-rendered and outside the frontend bundle, like the passcode gate, so
 * nothing of the prototype is served before a login. Spring's form login handles POST /login. Only
 * in login mode.
 */
@Controller
@ConditionalOnProperty(name = "prototype.protection-mode", havingValue = "login")
public class LoginController {

  @GetMapping(path = SecurityConfig.LOGIN_PATH, produces = MediaType.TEXT_HTML_VALUE)
  public ResponseEntity<String> show(HttpServletRequest request) {
    boolean failed = request.getParameter("error") != null;
    CsrfToken csrf = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
    String errorHtml = failed ? "<p role=\"alert\">The username or password is not valid.</p>" : "";
    String html =
        """
        <!doctype html>
        <html lang="en">
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="robots" content="noindex"><title>Sign in</title></head>
        <body>
        <main>
        <h1>Sign in</h1>
        <form method="post" action="%s">
        <label for="username">Username</label>
        <input id="username" name="username" autocomplete="username" required autofocus>
        <label for="password">Password</label>
        <input id="password" name="password" type="password" autocomplete="current-password" required>
        <input type="hidden" name="%s" value="%s">
        <button type="submit">Sign in</button>
        </form>
        %s
        </main>
        </body>
        </html>
        """
            .formatted(
                SecurityConfig.LOGIN_PATH,
                HtmlUtils.htmlEscape(csrf.getParameterName()),
                HtmlUtils.htmlEscape(csrf.getToken()),
                errorHtml);
    return ResponseEntity.status(failed ? HttpStatus.UNAUTHORIZED : HttpStatus.OK)
        .header("Cache-Control", "no-store")
        .contentType(MediaType.TEXT_HTML)
        .body(html);
  }
}
