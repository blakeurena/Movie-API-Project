# Copilot instructions for Movie poster api

## Project snapshot
- This is a static frontend app: `index.html` + `styles.css` + `app.js` (no bundler, no framework, no module system).
- Runtime flow is browser-only: `index.html` loads `app.js` with `defer`, then `fetchMovies()` runs immediately.
- Data source is OMDb (`https://www.omdbapi.com`) using a hardcoded `API_KEY` and a fixed `movieTitles` list in `app.js`.

## Architecture and data flow
- Primary pipeline in `app.js`:
  1. `fetchMovies()` requests all titles with `Promise.all`.
  2. Results are normalized into `movies` with fallbacks (`poster`, `description`, numeric `year`).
  3. `filteredMovies` is derived from `movies`.
  4. `renderMovies()` updates `#moviesList` via `innerHTML` using `movieCardHTML()`.
- Search/sort are stateful and coupled:
  - `searchMovies(event)` updates `filteredMovies`.
  - `applySort(value)` always sorts a cloned `filteredMovies` and re-renders.

## Critical conventions in this codebase
- Keep browser-global functions used by inline handlers in `index.html`:
  - `searchMovies(event)`, `sortMovies(event)`, `scrollToTop(event)`.
  - If renamed or scoped, update HTML handler attributes too.
- Preserve `movieTitles` order semantics:
  - `order` and displayed “Film #N” come from original array order, not release chronology.
- Maintain existing fallback UX patterns in `fetchMovies()`:
  - Missing poster -> placeholder image URL.
  - Missing plot -> "No description available."
  - Empty results -> `.error-message` text in `#moviesList`.
- Prefer existing rendering style (template literals + one `innerHTML` assignment) over incremental DOM APIs unless requested.

## Styling patterns
- CSS follows component-like `block__element--modifier` naming (`.movie__card`, `.nav__link--primary`).
- Layout relies on reusable wrappers (`.container`, `.row`) and responsive breakpoints at `1024px`, `768px`, `480px` in `styles.css`.
- Keep dark theme palette and accent color (`#ef4444`) consistent with existing nav, buttons, and links.

## Developer workflow
- No build/test scripts are defined in the repository currently.
- Local verification is manual in a browser:
  - load `index.html`
  - verify API fetch success/failure path, search, sort, and responsive layout.
- For networking/debugging, use browser DevTools console + Network tab; errors are logged with `console.error` in `fetchMovies()`.

## Safe-change guidance
- Keep edits small and file-local unless cross-file wiring is required.
- Do not introduce framework/tooling migrations (React/Vite/etc.) unless explicitly requested.
- If touching API config, preserve current behavior or clearly document migration to environment-based secrets.