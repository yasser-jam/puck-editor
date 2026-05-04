# Builder Model: Theme, Pages, Sections, Blocks, and JSON Output

This document explains the page-builder structure clearly, from configuration to final output.

## 1) Theme configuration comes first

- The workflow starts with **theme configuration**.
- The most important style variables are defined as **design tokens**.
- Tokens are separated into **tabs/groups** for easier editing (for example: colors, typography, spacing, radius, shadows).
- These tokens become the shared style source for all pages and blocks.

## 2) Then pages are created

- After theme setup, users create **pages**.
- Each page is a top-level container in the builder.
- A page is composed of multiple **sections**.

## 3) Each section is a grid that accepts blocks

- Every section uses a **grid layout**.
- Blocks are added into the section grid.
- Grid structure controls placement and composition on the page.

## 4) Blocks are of two main types

### A) Static blocks

- Pure presentational blocks with no embedded domain data.
- Examples: button, paragraph/text, image, heading, divider.

### B) Bound blocks

- Data-connected blocks with embedded/bound data behavior.
- Examples: product card, product grid/list, cart summary, dynamic content widgets.

## 5) Every block supports customization via two style sources

Each block exposes customization options with two primary modes:

1. **Token-based values (from theme)**
   - Example: `color: primary` (default behavior)
   - Keeps styling consistent across pages
   - Updates automatically when theme tokens change

2. **Static/direct values**
   - Example: `color: #434`
   - Allows one-off, explicit overrides when needed

## 6) Everything is stored in one JSON document

- Theme configuration, pages, sections, grid layout, blocks, and block customizations are merged into a **single JSON file**.
- The same JSON powers both:
  - **Builder** (editing/authoring experience)
  - **Renderer** (runtime page output)
- This creates one source of truth for design + structure + content bindings.