# Source documentation registry

`src/docs/` contains application-facing documentation metadata and concise engineering notes.
The canonical long-form Markdown documentation remains under the repository-level `docs/` directory.

Do not import large Markdown files into client bundles. UI surfaces should consume the typed registry in `src/docs/index.ts` and fetch/render documentation separately when needed.
