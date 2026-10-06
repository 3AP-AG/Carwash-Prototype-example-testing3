// The form messages the client reads, in the UI language. The generated Zod schemas carry the
// backend's rules, but their default texts are technical ("Zu klein: erwartet, dass string >=1
// Zeichen hat"), so these replace them. A date or time field in the browser is either empty or
// valid, which is why an invalid format reads as "not filled in". A side-effect module: the app
// entry (main.tsx) and the test setup load it once.
import * as zod from 'zod';

const REQUIRED = 'Bitte ausfüllen.';

zod.config(zod.locales.de());
zod.config({
  customError: (issue) => {
    switch (issue.code) {
      case 'invalid_type':
      case 'invalid_format':
      case 'too_small':
        return REQUIRED;
      case 'too_big':
        return typeof issue.maximum === 'number' ? `Höchstens ${issue.maximum} Zeichen.` : undefined;
      default:
        return undefined;
    }
  },
});
