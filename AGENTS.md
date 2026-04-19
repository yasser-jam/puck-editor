# AGENTS.md — Puck Editor Monorepo

> Persistent context for AI agents working in this repository. Read this before making changes. Keep it up to date when architecture shifts.

---

## 1. What this project is

**Puck** is a modular, open-source **visual/drag-and-drop editor for React**. It lets applications render a page builder UI over a user-defined set of React components. It is distributed as a library (`@puckeditor/core`), not a hosted product — consumers own their data and there is no vendor lock-in. Marketing tagline: _"Create your own AI page builder."_ MIT licensed.

Key properties:

- **Library-first**: `Puck` is just a React component — drop it into any React app (Next.js, Remix, React Router v7, plain React).
- **Config-driven**: users declare a `Config` object (components, fields, root, categories) and Puck renders the editor around it.
- **Extensible**: plugins, overrides, custom fields, permissions, field transforms, and RSC-capable rendering.
- **No vendor lock-in**: data is plain JSON owned by the consumer.

---

## 2. Repository layout

Yarn 1 workspaces monorepo, orchestrated by **Turborepo** (builds/tests) and **Lerna** (versioning/publishing).

```
puck-editor/
├── apps/
│   ├── demo/           # Next.js 16 demo / dev playground for @puckeditor/core
│   └── docs/           # Documentation site (Next.js + Nextra)
├── packages/
│   ├── core/                      # Main published library (@puckeditor/core)
│   ├── create-puck-app/           # CLI: `npx create-puck-app`
│   ├── field-contentful/          # `createFieldContentful` external field helper
│   ├── plugin-emotion-cache/      # Emotion cache wiring for iframe preview
│   ├── plugin-heading-analyzer/   # Heading outline / a11y plugin
│   ├── eslint-config-custom/      # Shared ESLint config (next + turbo + prettier)
│   ├── tsconfig/                  # Shared tsconfig bases (base, react-library, nextjs)
│   └── tsup-config/               # Shared tsup + PostCSS Modules pipeline
├── recipes/                # Starter templates used by create-puck-app
│   ├── next/  next-ai/
│   ├── remix/ remix-ai/
│   └── react-router/ react-router-ai/
├── scripts/                # Release + Puppeteer smoke-test scripts
└── .github/workflows/      # CI, publish, publish-canary
```

- **Node**: `>=20` (see `.nvmrc` and `package.json#engines`).
- **Package manager**: `yarn@1.22.19` — do **not** switch to npm/pnpm/yarn-berry.
- **Primary dev command**: `yarn dev` (cleans `packages/core/dist` then runs `turbo run dev --filter=demo`).

---

## 3. `packages/core` architecture

This is the heart of the project. Source lives directly under `packages/core/` (there is **no `src/` folder**). Key folders:

| Folder | Purpose |
|---|---|
| `bundle/` | Build entry points (`core.ts`, `rsc.tsx`, `internal.ts`, `no-external.ts`) consumed by tsup |
| `components/` | React components — `Puck`, `Render`, `DropZone`, `AutoField`, `ActionBar`, `Drawer`, `DragDropContext`, etc. |
| `store/` | **Zustand** app store (`createAppStore`) with slices: `history`, `nodes`, `permissions`, `fields` |
| `reducer/` | `createReducer` and `PuckAction` types — all state mutations flow through actions |
| `types/` | Public TypeScript types (`Config`, `Data`, `Fields`, `API/Overrides`, `API/Plugin`, `Props`) |
| `lib/` | Helpers: `use-puck`, `walkTree`, `setDeep`, `migrate`, `transform-props`, `overlay-portal`, DnD helpers |
| `plugins/` | Built-in plugins: `blocks`, `fields`, `outline`, `legacy-side-bar` |

### Public API (from `packages/core/bundle/core.ts`)

Authoritative export list — when adding new public surface, update this file.

- Components: `Puck`, `Render`, `DropZone`, `AutoField`, `FieldLabel`, `Button`, `IconButton`, `Drawer`, `ActionBar`, `RichTextMenu`
- Hooks/APIs: `usePuck`, `useGetPuck`, `createUsePuck`, `PuckApi`, `UsePuckData`
- Types: everything from `types/API`, `types/Data`, `types/Props`, `types/Fields`
- Utilities: `migrate`, `transform-props`, `resolve-all-data`, `setDeep`, `walkTree`, `registerOverlayPortal`
- Built-in plugins: exports from `plugins/blocks`, `plugins/fields`, `plugins/outline`, `plugins/legacy-side-bar`
- Reducer action type: `PuckAction` (via `reducer/actions`)

### Entry points (conditional exports in `package.json`)

| Entry | Use case |
|---|---|
| `@puckeditor/core` | Default client bundle (full editor) |
| `@puckeditor/core/rsc` | RSC-safe `Render` + data utilities (server components) |
| `@puckeditor/core/internal` | `createReducer` for advanced integrations |
| `@puckeditor/core/puck.css` | Default styles |
| `@puckeditor/core/no-external.css` | Styles without externalized CSS vars |

### State management

- **Zustand** + `subscribeWithSelector`.
- Single `createAppStore` in `packages/core/store/index.ts`.
- State is **sliced** (`history`, `nodes`, `permissions`, `fields`) — keep slices cohesive; don't reach across slices directly, go through exposed actions.
- All mutations go through `reducer/` actions (`PuckAction`). When adding new behavior, **define a new action**, don't mutate store state imperatively from components.

### Drag-and-drop

- **@dnd-kit** (`@dnd-kit/react`, `@dnd-kit/dom`, `@dnd-kit/abstract`, `@dnd-kit/helpers`).
- **Not** `react-dnd`. Do not introduce `react-dnd`.
- Entry: `components/DragDropContext/index.tsx`; helpers in `lib/dnd/`.

### Config system (the user-facing contract)

Users pass `<Puck config={config} data={data} />`. A `Config`:

```ts
type Config = {
  components: {
    [type: string]: {
      fields: Record<string, Field>;
      render: (props) => ReactElement;
      defaultProps?: Props;
      resolveFields?: (data, params) => Promise<Fields> | Fields;
      resolveData?: (data, params) => Promise<Data> | Data;
      resolvePermissions?: (data, params) => Promise<Permissions> | Permissions;
      permissions?: Partial<Permissions>;
      metadata?: Record<string, any>;
    };
  };
  root?: { /* same shape, for the page root */ };
  categories?: Record<string, { components: string[]; title?: string }>;
};
```

See `packages/core/types/Config.tsx` for the source of truth.

### Field types

Dispatched by `AutoField` (`components/AutoField/index.tsx`). Source: `packages/core/types/Fields.ts`.

- `text`, `number`, `textarea`
- `select`, `radio`
- `richtext` (**TipTap**-based)
- `array`, `object`
- `external` (with `fetchList` / optional legacy adaptor shape)
- `custom` — user supplies `render`
- `slot` — nested droppable region

Users can extend field types via `overrides.fieldTypes`.

### Plugin system

```ts
type Plugin<UserConfig extends Config = Config> = {
  name?: string;
  label?: string;
  icon?: ReactNode;
  render?: () => ReactElement;
  overrides?: Partial<Overrides<UserConfig>>;
  fieldTransforms?: FieldTransforms<UserConfig>;
  mobilePanelHeight?: "toggle" | "min-content";
};
```

Passed to `<Puck plugins={[...]} />`. Built-in plugins under `packages/core/plugins/`. External plugin packages follow the same shape (see `plugin-emotion-cache`, `plugin-heading-analyzer`).

### Overrides

Declarative UI slots, typed in `packages/core/types/API/Overrides.ts`:

`fieldTypes`, `header`, `headerActions`, `actionBar`, `preview`, `fields`, `drawer`, `drawerItem`, `iframe`, `componentOverlay`, `puck`, etc. Accepted as `overrides` prop on `Puck` or merged from plugins.

### Permissions

`Permissions` type (`types/API/index.ts`): `drag`, `duplicate`, `delete`, `edit`, `insert`, and more. Resolved through `store/slices/permissions.ts` — merges global `permissions` prop, per-component config, and `resolvePermissions` callbacks. Don't bypass this flow.

---

## 4. Apps and recipes

- `apps/demo` — Next.js 16 + React 19. The primary dev playground. Runs on port 3000 via `yarn dev`. Component config lives in `apps/demo/config/` (variable named `conf` to avoid Next.js naming collision). Routes use catch-all `[...puckPath]` for edit vs view modes.
- `apps/docs` — Nextra-powered Next.js docs site.
- `recipes/*` — minimal starter templates for `create-puck-app`. Each variant pair (`next` / `next-ai`, etc.) demonstrates the same integration with and without **Puck AI**. Keep recipes minimal and aligned with published APIs — they are user-facing templates.

---

## 5. Tooling

| Concern | Tool |
|---|---|
| Monorepo build | **Turborepo** (`turbo.json`) |
| Versioning / publish | **Lerna** (`lerna version`, `lerna publish`) |
| Package manager | **Yarn 1** (workspaces: `apps/*`, `recipes/*`, `packages/*`) |
| Package bundler | **tsup** with shared config in `packages/tsup-config` (ESM + CJS + CSS Modules via PostCSS) |
| Unit tests | **Jest** + `ts-jest` + `jsdom` (`packages/core/jest.config.ts`) |
| E2E / smoke | **Puppeteer** (`scripts/e2e/smoke.mjs`, run via `yarn smoke`) |
| Lint | **ESLint** via `eslint-config-custom` |
| Format | **Prettier** (`yarn format` / `yarn format:check`) on `**/*.{ts,tsx,md,mdx,css}` |

Common scripts (run from repo root):

```bash
yarn install          # install all workspaces
yarn dev              # clean core/dist + `turbo run dev --filter=demo`
yarn build            # turbo run build (all packages)
yarn test             # turbo run test
yarn lint             # turbo run lint
yarn format           # prettier --write
yarn smoke            # puppeteer smoke E2E
```

---

## 6. Conventions (follow these)

### TypeScript
- **Avoid `any`**. Prefer precise types or `unknown` + narrowing.
- Public types live under `packages/core/types/` — changes here are **public API changes** and require extra scrutiny.
- Extend the shared `tsconfig` package — do not hand-roll tsconfigs in new packages.

### Components
- Folder-per-component: `components/<Name>/index.tsx` with colocated `styles.module.css`.
- Client components mark themselves with `"use client"` where needed. `Render` has a client variant and a server-safe `ServerRender` used from the `/rsc` entry.

### CSS
- **CSS Modules** (`.module.css`) — no global CSS in components.
- Class names follow **SUIT CSS** conventions (`ComponentName`, `ComponentName-descendent`, `ComponentName--modifier`).
- Use the `getClassNameFactory` helper from `lib/get-class-name-factory` to generate class names from the styles module.

### State
- All store mutations via reducer actions (`PuckAction`). No direct `set` calls from UI.
- Subscribe via `usePuck` / `useGetPuck` / `createUsePuck` — **do not** create ad-hoc Zustand hooks that reach into internal slices.

### Tests
- Colocated under `__tests__/` folders adjacent to the code (see `reducer/actions/__tests__/`, `components/Puck/__tests__/`, `lib/__tests__/`).
- Name: `*.spec.ts` / `*.spec.tsx`.
- Run a single test file: `yarn workspace @puckeditor/core test <path>`.

### Commits & releases
- **Conventional Commits (angular preset)** — required for changelog generation and `release:prepare`.
- `release` / `release:canary` scripts drive Lerna-based version bumps. Do not manually edit package versions.

---

## 7. Things to do / avoid when making changes

### Do
- Run `yarn format` and `yarn lint` before proposing changes.
- Update `packages/core/bundle/core.ts` when adding new public exports.
- Update `types/` when changing public API shapes, and consider migration helpers (see `lib/migrate`).
- Add tests under the appropriate `__tests__/` folder.
- When touching DnD, verify with `yarn smoke` (Puppeteer).
- For new plugins, follow the `Plugin` type contract and ship them as a separate `packages/plugin-*` package with `tsup-config`.

### Don't
- Don't introduce a competing DnD library (stay on `@dnd-kit`).
- Don't introduce global CSS or inline `<style>` — use CSS Modules + SUIT.
- Don't add `any` to public types.
- Don't bypass the reducer to mutate store state.
- Don't break the RSC entry (`bundle/rsc.tsx`) — it must remain importable from React Server Components (no client-only dependencies at module top level).
- Don't modify `yarn.lock` unnecessarily or switch package managers.
- Don't edit generated `dist/` folders.

---

## 8. Quick-reference file paths

| What | Where |
|---|---|
| Public exports | `packages/core/bundle/core.ts` |
| `Puck` component | `packages/core/components/Puck/index.tsx` |
| `Render` component | `packages/core/components/Render/index.tsx` |
| App store | `packages/core/store/index.ts` |
| Reducer / actions | `packages/core/reducer/` |
| Field union types | `packages/core/types/Fields.ts` |
| Overrides keys | `packages/core/types/API/Overrides.ts` |
| Plugin type | `packages/core/types/API/index.ts` |
| DnD context | `packages/core/components/DragDropContext/index.tsx` |
| AutoField dispatch | `packages/core/components/AutoField/index.tsx` |
| Demo config | `apps/demo/config/index.tsx` |
| Smoke tests | `scripts/e2e/smoke.mjs` |
| Shared tsup config | `packages/tsup-config/index.ts` |
| Shared tsconfig | `packages/tsconfig/base.json` |

---

_Keep this document dense and current. If you change architecture, update the relevant section in the same PR._
