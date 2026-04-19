# AGENTS.md — SOOQ Design Studio (Puck-Based)

> Persistent context for AI agents working in this repository. Read this before making changes. Keep it up to date when architecture shifts.

---

## 0. Business context — why this repo exists

This codebase is the **Design Studio / Store Builder** of the **SOOQ** platform — a unified e-commerce + mobile app builder for the Syrian market. The full product spec is in `docs/SOOQ_SRS_IEEE_V9.8.md` (module **DSN**, section 4.2).

**The business idea in one paragraph.** Non-technical Syrian SME merchants (and customers in adjacent Arabic-speaking markets) need to launch a branded online store across **both web and a native Android app** without writing code. SOOQ provides a single visual editor — _this repo_ — that lets a merchant drag and drop pages, sections, and blocks once, and produces a single source of truth (`store_config.json`) that drives:

1. The **React web storefront**, and
2. A **Flutter Client App** (per-merchant white-label, OTA-updated by re-fetching the JSON without rebuilding the APK).

Strategic differentiators (vs. Shopify / Salla): SYP currency, Arabic-first RTL, Syrian payment methods (COD + Paymera eGate), JSON-driven OTA mobile UI, < 15 min APK builds via GitHub Actions, and a free tier priced for the Syrian economy.

**Why Puck.** SOOQ uses [Puck](https://puckeditor.com) as the underlying editor framework. Puck's `Config` → `Data` JSON contract (components, fields, plugins) maps cleanly to the SRS's **Page → Section → Block** hierarchy, gives us drag-and-drop and undo/redo for free, and is RSC-capable so the same renderer can drive web SSR. This repo is a fork/customization of the upstream `@puckeditor/core` monorepo, adapted for SOOQ's specific block catalog, theme tokens, and JSON output shape.

**The user-facing flow this code enables:**

```
Merchant opens Design Studio
        │
        ▼
Drags Sections / Blocks (Generic, Bound, Group)
Configures theme tokens, RTL, styles
        │
        ▼
Publishes  →  store_config.json  (UI/UX only — no business data)
                       │
       ┌───────────────┼───────────────┐
       ▼                               ▼
React Web Storefront            Flutter Client App
(SSR via @puckeditor/core/rsc)  (OTA fetch — no rebuild)
```

**Roadmap (informs design decisions):** Today the merchant edits manually. **Next milestone:** an AI agent updates `store_config.json` on the merchant's behalf based on natural-language prompts ("make my homepage feel more luxurious for Ramadan"). Manual editing remains supported and is the fallback. **Implication for code:** treat the editor's actions as a first-class, programmatic API surface — every UI mutation must also be reachable via reducer actions / `usePuck`, so an AI agent can drive the same flows headlessly.

---

## 1. What Puck is and how SOOQ uses it

**Puck** is a modular, open-source **visual/drag-and-drop editor for React**, distributed as `@puckeditor/core`. SOOQ adopts it as the foundation of the Design Studio (DSN module). Key properties:

- **Library-first**: `Puck` is just a React component — embedded in the SOOQ Merchant Admin Panel.
- **Config-driven**: SOOQ declares a `Config` object describing every block in the SRS catalog (Heading, Image, Product Grid, Cart Summary, etc.). Puck renders the editor around it.
- **JSON output is the contract**: Puck's `Data` JSON is what we serialize as `store_config.json` and serve from the Spring Boot backend to both clients (cached in Redis per tenant, NFR-CACHE-001).
- **Extensible**: plugins, overrides, custom fields, permissions, field transforms, RSC-capable rendering — all required for SOOQ's plugin needs (RTL toggle, theme engine, contrast guard, mobile preview frame, Bound blocks fetching tenant data).
- **No vendor lock-in**: data is plain JSON owned by SOOQ and the merchant.

### How Puck primitives map to the SRS

| SRS concept (DSN) | Puck primitive |
|---|---|
| **Page** (DSN-012) | Top-level Puck `Data` document; one per route |
| **Section** (DSN-003) | Puck root `zones` / top-level slot — reorderable container |
| **Block — Generic** (DSN-004 a–m) | Puck `components` entries with `fields` only, no data binding |
| **Block — Bound** (DSN-005 a–j) | Puck `components` entries that read tenant data via `resolveData` / `external` fields / runtime context |
| **Block — Group** (DSN-006, DSN-004k) | Puck `slot` field type — nested droppable region (depth ≤ 3) |
| **Block — Sidebar** (DSN-004l) | `Sidebar` — vertical `slot` container, `dock: inline \| left \| right` for page-level rails, sticky/offset options, mobile-collapsible |
| **Block — NavMenu** (DSN-004m) | `NavMenu` — repeating list of `{ label, link }` items, powered by the shared `LinkValue` primitive |
| **Site chrome — SiteDrawer** (DSN-004n) | Rendered from `root.tsx` (NOT a Puck block) — driven by the `drawer*` root fields (`drawerEnabled`, `drawerSide`, `drawerWidthPx`, `drawerAnimation`, `drawerLinks[]`, `drawerBackgroundColor`, etc.). Opened via the header menu button (`headerShowDrawerButton: true`), a floating trigger, auto-open, or ANY element with `data-sooq-drawer-toggle="site-drawer"`. The block in `apps/demo/config/blocks/SideDrawer/` is now legacy-only (hidden from the palette; kept registered so existing JSON still renders). |
| **Navigation target** | `LinkValue` custom field — discriminated union `{ kind: "none" \| "page" \| "external" \| "anchor", … }` stored directly in `props.link` on any navigable block |
| **Block styling** (DSN-008 a–h) | `fields` schema on each component (spacing/sizing/typography/colors/border/shadow/visibility) |
| **Theme tokens** (DSN-010) | Puck `Config.root.fields` + custom override panel; tokens injected as CSS vars |
| **Real-time preview** (DSN-011) | Puck's iframe preview + simulated mobile frame override |
| **Custom CSS per section** (DSN-009) | `custom` field type on the Section component |
| **RTL/LTR toggle** (DSN-001) | Custom plugin that flips a global flag + re-emits CSS direction |
| **Draft / Published** (DSN-016) | Two `Data` documents per tenant; backend persists both, only Published is fetched by clients |
| **Undo/redo** (DSN-018) | Puck's built-in `history` slice (already 20-step) |

**`store_config.json` is strictly UI/UX configuration** (pages → sections → blocks, theme tokens, layout positions). It contains **no business data** (no products, no orders, no prices). Bound blocks reference data sources by ID/query, and the consuming client (web or mobile) resolves them at render time against tenant APIs.

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

### Shared demo-app field primitives (under `apps/demo/config/fields/`)

These are not core-library features — they are conventions the demo app (and
the tenant pages we ship) rely on. AI agents mutating `store_config.json`
**MUST** emit these exact shapes when they appear in a block's props, so the
merchant editor and the mobile renderer deserialize them correctly.

- **`BilingualString`** — `{ ar: string, en: string }`. Used anywhere the SRS
  asks for bilingual copy. Resolve with `pickLang(value, language)`; fallback
  is `en → ar → ""`.

- **`LinkValue`** — discriminated union for navigation targets:
  ```ts
  type LinkValue =
    | { kind: "none" }
    | { kind: "page"; pageId: string; newTab?: boolean }   // pageId = canonical path, e.g. "/cart"
    | { kind: "external"; url: string; newTab?: boolean }
    | { kind: "anchor"; hash: string };                    // stored without leading '#'
  ```
  - Registered pages live in `apps/demo/config/pages.ts` (`PAGES[]`). Their
    `path` (or `examplePath` when dynamic) is the stable identifier used as
    `pageId`.
  - Renderers derive the final `href` via `resolveLinkHref(link)`, and the
    `target` / `rel` attributes via `resolveLinkTarget` / `resolveLinkRel`.
  - Prefer populating `link` in all new or refactored blocks. Legacy blocks
    that still expose a raw `href: string` must read via
    `resolveHrefLegacy(link, href)` so old `store_config.json` documents keep
    working.

  Blocks that carry navigation today: `Button`, `ContentButton`, each
  `NavMenu` item.

- **`ColorField`** (`apps/demo/config/fields/ColorField/`) — a compact custom
  field (swatch + native `<input type=color>` + hex text input + theme
  swatches). Use the `colorField({ label, description })` helper when
  declaring a field; the value is persisted as a raw CSS colour string
  (`"#rrggbb"`, `"rgba(...)"` or empty for "inherit theme"). Agents
  mutating colour props in `store_config.json` may emit any valid CSS
  colour; an empty string explicitly means "fall back to the active
  theme token".

- **`SectionHeader`** (`apps/demo/config/fields/SectionHeader/`) — a
  visual-only "field" used to divide long config panels (root, complex
  blocks) into labelled groups with an accent stripe. Declare with
  `sectionHeader({ title, description?, icon?, accent? })`. **It has no
  persisted value** — it is purely chrome and its JSON property is always
  `undefined`. Agents must never emit data for keys whose name starts
  with `__` (the convention for these separator fields).

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

### Do (SOOQ-specific)
- **Honor the `store_config.json` contract**: any new block must serialize to plain JSON. No functions, refs, or non-serializable values in `Data`.
- **Keep `store_config.json` UI/UX-only** (per SRS DSN-016 / glossary). Bound blocks reference data sources by ID/query — they must not embed product/order/customer payloads in the JSON.
- **Maintain RTL parity**: every new block must render correctly in both RTL (Arabic, default) and LTR. Add a smoke test toggling `DSN-001`.
- **Make every editor mutation reachable as a reducer action.** The roadmap requires an AI agent to drive the editor headlessly — UI-only side effects are forbidden.
- **Bilingual fields**: text blocks should support AR + EN values where the SRS calls for it (e.g., DSN-004a/b).
- **Mirror Generic / Bound / Group taxonomy** from SRS §4.2 when adding components — categorize via Puck `Config.categories`.
- **Cross-reference the SRS in PR descriptions**: cite the affected requirement IDs (e.g., "Implements DSN-008f shadow controls").
- **Use the `LinkValue` primitive for every navigation target** (Button, menu item, product card CTA, …). Never hardcode an `href: "/cart"` string when the destination maps to a registered page — emit `{ kind: "page", pageId: "/cart" }` instead, so merchant-facing AI agents can rewire navigation without string parsing.
- **Register every new route in `apps/demo/config/pages.ts`** before an AI agent can point a `LinkValue` at it. Unregistered paths become orphans on mobile where no router fallback exists.
- **Compose Sidebar + NavMenu instead of bespoke layouts** when a block needs a vertical panel of nav/filter items. Their JSON contract is stable and the Flutter renderer already understands it.
- **Choose the correct `Sidebar.dock` for the intent**: `"inline"` for a column next to main content (drop inside a 2-column Section), `"left"` / `"right"` for a global app rail pinned to the viewport edge (Shopify-admin style — Dashboard / Inventory / Customers / Marketing / Store Builder). When docked, set `dockOffsetTop` to the site header height so the rail starts below the header rather than under it. Docked sidebars use `position: fixed` and therefore do NOT push page content — if overlap is undesirable, add matching page padding via a wrapping Section's layout fields or via the root container.
- **Drive the site drawer from root fields, never from a block.** The drawer is part of the site shell (like the header/footer), not a per-page block. Configure it via the `drawer*` root fields and toggle it from any element with `data-sooq-drawer-toggle="site-drawer"` (e.g. the built-in header menu button enabled via `headerShowDrawerButton: true`). A single `replaceRoot` action can enable it, change its side, swap the animation, recolour the panel, and rewire the nav buttons — no block insertion/removal required.
- **Any overlay-style block (drawer, modal, popover, toast) MUST portal to `ownerDocument.body`.** `position: fixed` alone is not enough inside the editor canvas: `@dnd-kit`'s sortable, Puck's zoom `transform: scale(...)` on the iframe container, and arbitrary ancestor `transform/filter/perspective/contain` all create CSS containing blocks that hijack fixed positioning, causing the element to anchor mid-canvas instead of the viewport edge. `SideDrawer` is the reference implementation — portal the overlay + panel with `createPortal(..., anchorRef.current?.ownerDocument.body)` so the same component works in both the live site and the editor iframe with zero special-casing.
- **Use `SideDrawer` for transient side panels, never for always-visible rails.** `SideDrawer` is the dismissible, animated drawer (mobile hamburger, filter/facets panel, mini-cart peek, announcement drawer); `Sidebar` with `dock: "left" \| "right"` is the always-on rail. Never implement a drawer with a bespoke block — reuse `SideDrawer` and drive behaviour via its props. The `name` prop must be unique per drawer on a page so external triggers can target it: `window.sooqDrawers.toggle(name)`, `document.dispatchEvent(new CustomEvent("sooq:drawer", { detail: { name, action: "open" } }))`, or any element with `data-sooq-drawer-toggle="<name>"` (optional `data-sooq-drawer-action="open|close|toggle"`). When an AI agent adds a hamburger button to the Header, it should set that attribute rather than emit custom JS.
- **Set `Section.name` on every top-level section you insert** so the Shopify-style outline labels it meaningfully ("Hero", "Featured products", "Testimonials"). The list uses `props.name` → falls back to the component label only when empty.
- **Use `Section.anchorId` + `LinkValue.anchor` together** for in-page navigation. Setting `anchorId: "promo"` on a Section and `{ kind: "anchor", hash: "promo" }` on a NavMenu item is the ONLY supported way to do scroll-to-section — renderer attaches `<section id="promo">` automatically. Whitespace is auto-stripped, but stick to lowercase kebab-case (`featured-products`) so the same id works across web & Flutter.
- **Prefer reducer actions over custom side effects** for clipboard-style flows. The `canvas-interactions` plugin's copy/paste uses a module-level ref (not persisted) plus a standard `insert` action with `props` — mirror this pattern for any future "template snippets" / "saved sections" feature so AI agents can reproduce the same result by calling `insert` directly.
- **Drive the site shell from `root.props`, never from hardcoded React.** The header's brand, visibility, and nav links, plus the footer's columns/tagline/visibility, are all editable root fields (`title`, `headerVisible`, `headerBrandHref`, `headerLinks[]`, `footerVisible`, `footerTagline`, `footerTaglineAr`, `footerColumns[]`). `HeaderLink` / `FooterColumn` shapes live in `apps/demo/config/components/Header` and `…/Footer`; defaults come from `DEFAULT_HEADER_LINKS` / `DEFAULT_FOOTER_COLUMNS`. AI agents can set any of these to customise the whole-site shell in a single `replaceRoot` action — do NOT add a new block type for something that's inherently site-wide.

### Don't
- Don't introduce a competing DnD library (stay on `@dnd-kit`).
- Don't introduce global CSS or inline `<style>` — use CSS Modules + SUIT.
- Don't add `any` to public types.
- Don't bypass the reducer to mutate store state.
- Don't break the RSC entry (`bundle/rsc.tsx`) — it must remain importable from React Server Components (no client-only dependencies at module top level). The web storefront depends on it.
- Don't modify `yarn.lock` unnecessarily or switch package managers.
- Don't edit generated `dist/` folders.

### Don't (SOOQ-specific)
- **Don't write business data into `store_config.json`** (no products, orders, prices, customer info). That violates the DSN-016 / NFR-SAF-012 contract and breaks tenant isolation.
- **Don't hardcode currency, locale, or direction.** Use the theme/config layer — Syria-first means SYP and AR-RTL by default, not as an afterthought.
- **Don't introduce blocks that only render on web or only on mobile** without an explicit `visibility` flag or `web-only` declaration (DSN-008g, DSN-004j). Both renderers must be able to gracefully skip what they don't support.
- **Don't break OTA forward-compatibility.** Old Flutter Client App versions will fetch new `store_config.json` schemas — schema changes need a graceful fallback (see APP-004 alternative flow A1).
- **Don't add server-side dependencies** to blocks that need to render in the Flutter client. The Flutter renderer reads JSON only; no JS execution.

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
| Demo page registry | `apps/demo/config/pages.ts` |
| `BilingualString` primitive | `apps/demo/config/fields/BilingualText/` |
| `LinkValue` primitive + resolvers | `apps/demo/config/fields/LinkField/` |
| `ColorField` (swatch + picker) | `apps/demo/config/fields/ColorField/` |
| `SectionHeader` (visual group divider) | `apps/demo/config/fields/SectionHeader/` |
| Editor chrome overrides (CSS vars) | `apps/demo/app/styles.css` |
| Sidebar block (DSN-004l) | `apps/demo/config/blocks/Sidebar/` |
| NavMenu block (DSN-004m) | `apps/demo/config/blocks/NavMenu/` |
| SideDrawer block (legacy, DSN-004n) | `apps/demo/config/blocks/SideDrawer/` |
| Site-wide SiteDrawer (DSN-004n) | `apps/demo/config/components/SiteDrawer/` + `drawer*` fields in `apps/demo/config/root.tsx` |
| Editable header colours + drawer toggle button | `apps/demo/config/components/Header/index.tsx` + `headerBackgroundColor`/`headerTextColor`/`headerShowDrawerButton`/`headerDrawerButtonIcon` in `root.tsx` |
| Editable footer colours | `apps/demo/config/components/Footer/index.tsx` + `footerBackgroundColor`/`footerTextColor` in `root.tsx` |
| Editable site header (brand, nav, visibility) | `apps/demo/config/components/Header/index.tsx` + root fields in `apps/demo/config/root.tsx` |
| Editable site footer (columns, tagline, visibility) | `apps/demo/config/components/Footer/index.tsx` + root fields in `apps/demo/config/root.tsx` |
| Shopify-style outline + Add Section modal | `apps/demo/config/plugins/shopify-editor/` |
| Section preset catalog | `apps/demo/config/plugins/shopify-editor/section-catalog.tsx` |
| Canvas right-click menu + keyboard shortcuts | `apps/demo/config/plugins/canvas-interactions/` |
| Real-size drop preview on insert | `packages/core/components/DropZone/index.tsx` (`DropZoneChild` — inserts render the real component with defaultProps, not a drawer chip; see `[data-puck-insert-preview]` styles) |
| Smoke tests | `scripts/e2e/smoke.mjs` |
| Shared tsup config | `packages/tsup-config/index.ts` |
| Shared tsconfig | `packages/tsconfig/base.json` |
| **SOOQ SRS (source of truth)** | `docs/SOOQ_SRS_IEEE_V9.8.md` |
| **DSN module spec** | `docs/SOOQ_SRS_IEEE_V9.8.md` § 4.2 (Design Studio) |
| **`store_config.json` glossary entry** | `docs/SOOQ_SRS_IEEE_V9.8.md` Appendix A |

---

_Keep this document dense and current. If you change architecture, update the relevant section in the same PR._
