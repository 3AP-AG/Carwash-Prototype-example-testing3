// tokens.json → frontend/src/ui/tokens/: tokens.css (CSS custom properties) and tokens.ts (constants
// the MUI theme in ui/theme.ts reads). Run by `make generate`. Typography tokens are expanded into one
// value per property (font size, weight, …). Only ui/ reads these.
const here = new URL('.', import.meta.url).pathname;

// Not a design value: what the browser uses while the font loads or if it is missing.
const FALLBACK = 'system-ui, sans-serif';

export default {
  source: [`${here}tokens.json`],
  expand: { include: ['typography'] },
  hooks: {
    fileHeaders: {
      'tokens-header': () => [
        'GENERATED from design-tokens/tokens.json by `make generate`. Never edit by hand.',
      ],
    },
    transforms: {
      'fontFamily/fallback': {
        type: 'value',
        filter: (token) => (token.$type ?? token.type) === 'fontFamily',
        transform: (token) => `'${token.$value ?? token.value}', ${FALLBACK}`,
      },
    },
  },
  platforms: {
    css: {
      transforms: ['attribute/cti', 'name/kebab', 'fontFamily/fallback'],
      buildPath: `${here}../frontend/src/ui/tokens/`,
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { outputReferences: false, fileHeader: 'tokens-header' },
        },
      ],
    },
    ts: {
      transforms: ['attribute/cti', 'name/pascal', 'fontFamily/fallback'],
      buildPath: `${here}../frontend/src/ui/tokens/`,
      files: [{ destination: 'tokens.ts', format: 'javascript/es6', options: { fileHeader: 'tokens-header' } }],
    },
  },
};