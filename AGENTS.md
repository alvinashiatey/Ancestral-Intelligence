## Purpose

- This document orients autonomous agents to the SvelteKit+TypeScript workspace so they can contribute safely and consistently.
- Treat `pnpm` as the primary package manager; other commands in README (npm/yarn) are available but pnpm is canonical.

## Quick Setup

- Run `pnpm install` once per workspace to populate `node_modules` for the monorepo-aware config.
- When switching branches or when CI fails, `pnpm install --immutable` helps keep lockfile drift in check.
- Always run `pnpm run prepare` before lint/check workflows to keep SvelteKit metadata synced.
- Prefer `pnpm` for ad-hoc scripts, e.g., `pnpm run dev` (dev server), `pnpm run build`, `pnpm run preview`.

## Build/Lint/Test Commands

| Task               | Command            | Notes                                                                       |
| ------------------ | ------------------ | --------------------------------------------------------------------------- |
| Development server | `pnpm run dev`     | Starts Vite dev server; drop `-- --open` to auto-open browser.              |
| Production build   | `pnpm run build`   | Outputs to `build/` via Vite and SvelteKit adapter-auto.                    |
| Preview build      | `pnpm run preview` | Serves the production build locally (use this before deploying).            |
| Type/kit check     | `pnpm run check`   | Runs `svelte-kit sync` then `svelte-check --tsconfig ./tsconfig.json`.      |
| Lint               | `pnpm run lint`    | Runs `prettier --check .` then `eslint .` (configured for Svelte/TS files). |
| Format             | `pnpm run format`  | Runs `prettier --write .`; cross-platform friendly.                         |

## Running a Single Test (or Focused Check)

- This repo currently lacks a dedicated test suite, but you can target lint/check tasks modularly:
  1. For a single `.svelte` or `.ts` file, run `pnpm exec eslint path/to/file.svelte --fix` to catch lint issues.
  2. For type-checking a single scope, run `pnpm exec svelte-check --tsconfig ./tsconfig.json --include path/to/file.svelte`.
  3. Use `pnpm exec prettier --check path/to/file` when only formatting needs verification.

## Naming Conventions

- Prefer semantic nouns for components: `Header`, `Nav`, `FilteredImage` etc.
- Keep `src/lib/types` exports singular and descriptive (`SEOData`, `createSEOData`).
- File names should match default export when practical (e.g., `FilteredImage.svelte`).
- CSS classes use kebab-case; Svelte scoped styles isolate them.
- Variables in scripts follow camelCase; constants (e.g., `defaultSEO`) use camelCase as well except when names represent config keys.

## Imports

- Always use `$lib` aliases for shared modules (`import Header from '$lib/components/layout/Header.svelte';`).
- Prefer relative imports only for nearby siblings; avoid deep relative chains like `../../../`.
- Order imports by category:
  1. Node built-ins (if any) 2. External packages 3. `$lib/*` alias 4. Relative locals.
- Group styles, scripts, types separately when possible for readability.
- Keep import statements alphabetized within each group.

## TypeScript & typings

- Enable `lang="ts"` on `<script>` blocks for all Svelte components; the template already uses `lang="ts"`.
- Prefer explicit typing for props and helper functions instead of `any`.
- Use interfaces/`type` aliases (e.g., `SEOData`) to describe data contracts; extend only when necessary.
- Avoid inline `any`; if third-party data is untyped, wrap it with `unknown` + assertion guard functions.
- Keep `tsconfig.json` aligned with SvelteKit defaults; add overrides only when required.

## Formatting

- Base formatting is managed by Prettier + `prettier-plugin-svelte`; do not format manual CSS or JS with other tools.
- Keep component markup organized: scripts at top, markup next, `<style>` last.
- Use two-space indentation inside Svelte markup and CSS for readability.
- Keep lines under ~120 characters; wrap attributes and text nodes when they grow.
- Use `<svelte:head>` for head changes, `<svelte:window>` for global listeners.

## Styles & Layout

- Use CSS variables defined via `:root` or `app.html` when possible for colors, spacing, fonts.
- Layouts should favor `var(--padding-main-block)` etc. to keep spacing consistent.
- Avoid inline `width`/`color` values sprinkled across components; centralize in reusable classes if repeated.
- Prefer system fonts with fallbacks when defining `--font-primary-italic`; avoid vendor-locked typefaces unless new asset demands.
- Animate thoughtfully: transitions in `FilteredImage` are purposeful (hover fade + pointer shift). Preserve those behaviors when refactoring.

## Component Structure

- Keep components focused: `FilteredImage` handles SVG filter logic, while `Nav` is a static nav list.
- When adding new components, place them under `src/lib/components/` and index them if they will be re-exported.
- For layout components like `Header`/`Nav`, centralize shared styles in layout-specific directories.
- Use `<script lang="ts">` with destructured props (`const { src, alt = '' } = $props...`).
- Manage local state with `let` + `$effect` for lifecycle or `@html`/`{@render}` only when necessary.

## Error Handling & Robustness

- Favor early returns and default values (see `createSEOData`) over thrown errors when missing optional props.
- Use `try/catch` blocks sparingly; default to user-facing fallback UI instead of full crash.
- Rely on runtime guards (e.g., check for `caption` before rendering) rather than assuming values.
- For asynchronous effects, cancel handles on cleanup (see `FilteredImage` `requestAnimationFrame` teardown).
- Log to console only during debugging; remove before committing unless part of a documented debug workflow.

## Accessibility

- All `<img>` elements should have descriptive `alt` text; empty alt tags may be allowed for decorative duplicates (e.g., filtered overlay uses `alt=""`).
- Use semantic markup (e.g., `<nav>`, `<section>`, `<figure>`, `<figcaption>`).
- Keep keyboard/touch interactions accessible; pointer events should be non-blocking (`pointer-events: none` for overlays).
- Manage focus when introducing modals or interactive widgets; this repo currently has none, keep future additions consistent.

## CSS Guidelines

- Avoid `!important`; prefer cascade control with specificity and component boundaries.
- Prefer utility classes minimally; let component styles live within `<style>` tags for scoping.
- Use descriptive class names (`.photo-wrap`, `.caption`, `.about`) with contextual semantics.
- When adding new CSS, use CSS variables for colors/spacings to support theming later.
- Keep custom properties `var(--padding-main-block)` etc. for consistent spacing units.

## Assets & Static Files

- Images referenced via `/images/...` should live under `static/images`; maintain consistent naming.
- SVG assets may be imported (see `$lib/assets/favicon.svg`) if inline control is needed.
- Avoid bundling large assets; let Vite handle asset optimization automatically.

## Git Workflow for Autonomous Agents

- Report status with `git status` before starting; do not unset unrelated dirty files.
- Do not create commits unless explicitly asked; if asked, describe changes with intent-focused message referencing why.
- If you intentionally skip formatting or linting (e.g. tests fail), mention it and include commands used.
- When resolving merge conflicts, prefer project conventions (Svelte script first, markup, styles).
- Tag the user in your final message when handing off any manual follow-up.

## Documentation and External Resources

- Core docs: Svelte 5 / SvelteKit are authoritative; follow `sv`/`svelte-kit` guidance for routing/kit specifics.
- Use `svelte-check`, `eslint`, `prettier` doc pages if uncertain about configuration values.
- No Cursor or Copilot rules are present currently; continue monitoring `.cursor/` or `.github/` directories if they appear.

## Final Notes for Agents

- Keep components tight and purposeful; most styles are handwritten, so be deliberate about layout adjustments.
- When adding tooling, document new commands in this file under the appropriate section.
- Use the new AGENTS.md as the control center: update this doc whenever repo-wide norms change.

# context-mode — MANDATORY routing rules

You have context-mode MCP tools available. These rules are NOT optional — they protect your context window from flooding. A single unrouted command can dump 56 KB into context and waste the entire session.

## BLOCKED commands — do NOT attempt these

### curl / wget — BLOCKED
Any shell command containing `curl` or `wget` will be intercepted and blocked by the context-mode plugin. Do NOT retry.
Instead use:
- `context-mode_ctx_fetch_and_index(url, source)` to fetch and index web pages
- `context-mode_ctx_execute(language: "javascript", code: "const r = await fetch(...)")` to run HTTP calls in sandbox

### Inline HTTP — BLOCKED
Any shell command containing `fetch('http`, `requests.get(`, `requests.post(`, `http.get(`, or `http.request(` will be intercepted and blocked. Do NOT retry with shell.
Instead use:
- `context-mode_ctx_execute(language, code)` to run HTTP calls in sandbox — only stdout enters context

### Direct web fetching — BLOCKED
Do NOT use any direct URL fetching tool. Use the sandbox equivalent.
Instead use:
- `context-mode_ctx_fetch_and_index(url, source)` then `context-mode_ctx_search(queries)` to query the indexed content

## REDIRECTED tools — use sandbox equivalents

### Shell (>20 lines output)
Shell is ONLY for: `git`, `mkdir`, `rm`, `mv`, `cd`, `ls`, `npm install`, `pip install`, and other short-output commands.
For everything else, use:
- `context-mode_ctx_batch_execute(commands, queries)` — run multiple commands + search in ONE call
- `context-mode_ctx_execute(language: "shell", code: "...")` — run in sandbox, only stdout enters context

### File reading (for analysis)
If you are reading a file to **edit** it → reading is correct (edit needs content in context).
If you are reading to **analyze, explore, or summarize** → use `context-mode_ctx_execute_file(path, language, code)` instead. Only your printed summary enters context.

### grep / search (large results)
Search results can flood context. Use `context-mode_ctx_execute(language: "shell", code: "grep ...")` to run searches in sandbox. Only your printed summary enters context.

## Tool selection hierarchy

1. **GATHER**: `context-mode_ctx_batch_execute(commands, queries)` — Primary tool. Runs all commands, auto-indexes output, returns search results. ONE call replaces 30+ individual calls.
2. **FOLLOW-UP**: `context-mode_ctx_search(queries: ["q1", "q2", ...])` — Query indexed content. Pass ALL questions as array in ONE call.
3. **PROCESSING**: `context-mode_ctx_execute(language, code)` | `context-mode_ctx_execute_file(path, language, code)` — Sandbox execution. Only stdout enters context.
4. **WEB**: `context-mode_ctx_fetch_and_index(url, source)` then `context-mode_ctx_search(queries)` — Fetch, chunk, index, query. Raw HTML never enters context.
5. **INDEX**: `context-mode_ctx_index(content, source)` — Store content in FTS5 knowledge base for later search.

## Output constraints

- Keep responses under 500 words.
- Write artifacts (code, configs, PRDs) to FILES — never return them as inline text. Return only: file path + 1-line description.
- When indexing content, use descriptive source labels so others can `search(source: "label")` later.

## ctx commands

| Command | Action |
|---------|--------|
| `ctx stats` | Call the `stats` MCP tool and display the full output verbatim |
| `ctx doctor` | Call the `doctor` MCP tool, run the returned shell command, display as checklist |
| `ctx upgrade` | Call the `upgrade` MCP tool, run the returned shell command, display as checklist |
