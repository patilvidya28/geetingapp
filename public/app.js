/**
 * Browser entry: small wrapper that calls the library code.
 * Copied from `src/app.js` but adapted for browser module export.
 */
import { initApp } from './src/app.js';

window.addEventListener('DOMContentLoaded', () => {
  initApp(document);
});
