import React from "react";
import {
  LayoutTemplate,
  ShoppingBag,
  Sparkles,
  MessageSquareText,
  Star,
  Mail,
  UserRound,
  Heart,
  Images,
  Grid3x3,
  Type as TypeIcon,
  Columns2,
  Rows2,
} from "lucide-react";
import type { Data } from "@/core";

/**
 * Shopify-style Section Catalog.
 *
 * Each entry is a "preset" that can be inserted from the Add Section modal.
 * A preset produces a fully-formed, JSON-serializable payload (type + props,
 * including any nested slot content) that the editor dispatches via the
 * reducer. **All state persists to `store_config.json`** — there is no hidden
 * editor-only state attached to a section.
 *
 * Categories mirror SRS § 4.2 taxonomy:
 *   - hero:     large marketing bands, page openers
 *   - commerce: DSN-005 a-f bound-to-tenant-data blocks
 *   - customer: DSN-005 g-j customer-account-surface blocks
 *   - content:  DSN-004 a-j generic text/media blocks
 *   - layout:   columns / grids / groups
 */

export type SectionCategory =
  | "hero"
  | "commerce"
  | "customer"
  | "content"
  | "layout";

export type SectionPreset = {
  /** Stable key — never rename (persisted in analytics, not in JSON). */
  id: string;
  label: string;
  description: string;
  category: SectionCategory;
  icon: React.ReactNode;
  /** CSS background for the card thumbnail (gradient, color, etc.). */
  gradient: string;
  /**
   * Build the ComponentData shape to insert into the root content array.
   * Always returns type "Section" so it satisfies the root DropZone
   * `allow={["Section"]}` contract — specialised presets wrap themselves
   * in a Section.
   */
  build: () => {
    type: string;
    props: Record<string, unknown>;
  };
};

// ─── Helpers ────────────────────────────────────────────────────────────────

// Section defaultProps mirror apps/demo/config/blocks/Section/index.tsx.
// Kept in sync manually rather than imported to keep preset metadata
// purely declarative.
const SECTION_BASE_PROPS = {
  paddingTop: "64px",
  paddingBottom: "64px",
  paddingHorizontal: "24px",
  backgroundColor: "#ffffff",
  theme: "light" as const,
  maxWidth: "1280px",
  columns: 1,
  gridGap: "24px",
};

const section = (
  overrides: Partial<typeof SECTION_BASE_PROPS> & {
    content?: unknown[];
  } = {}
) => ({
  type: "Section",
  props: {
    ...SECTION_BASE_PROPS,
    content: [],
    ...overrides,
  },
});

// ─── Catalog entries ────────────────────────────────────────────────────────

export const sectionCatalog: SectionPreset[] = [
  // ── Hero / Opener ────────────────────────────────────────────────────────
  {
    id: "empty-section",
    label: "Empty Section",
    description: "Start from scratch — add any blocks inside.",
    category: "layout",
    icon: <LayoutTemplate size={20} />,
    gradient: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
    build: () => section(),
  },
  {
    id: "hero-band",
    label: "Hero Band",
    description: "Full-width hero with dark background, generous padding.",
    category: "hero",
    icon: <Sparkles size={20} />,
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)",
    build: () =>
      section({
        paddingTop: "96px",
        paddingBottom: "96px",
        backgroundColor: "#0f172a",
        theme: "dark",
        maxWidth: "100%",
      }),
  },
  {
    id: "narrow-content",
    label: "Narrow Content",
    description: "Centred column for prose — good for About, Policy pages.",
    category: "content",
    icon: <Rows2 size={20} />,
    gradient: "linear-gradient(135deg, #fafafa 0%, #f3f4f6 100%)",
    build: () =>
      section({
        maxWidth: "768px",
        paddingTop: "48px",
        paddingBottom: "48px",
      }),
  },
  {
    id: "two-column",
    label: "Two-column Layout",
    description: "Split content into two equal columns.",
    category: "layout",
    icon: <Columns2 size={20} />,
    gradient: "linear-gradient(90deg, #eff6ff 0%, #eff6ff 50%, #f0fdf4 50%, #f0fdf4 100%)",
    build: () => section({ columns: 2, gridGap: "32px" }),
  },

  // ── Commerce (DSN-005 a-f) ──────────────────────────────────────────────
  {
    id: "products-grid",
    label: "Products Grid",
    description: "Featured collection / product grid bound to tenant data.",
    category: "commerce",
    icon: <Grid3x3 size={20} />,
    gradient: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
    build: () => ({
      type: "Section",
      props: {
        ...SECTION_BASE_PROPS,
        paddingTop: "48px",
        paddingBottom: "48px",
        content: [
          {
            type: "ProductsGrid",
            props: {},
          },
        ],
      },
    }),
  },
  {
    id: "category-list",
    label: "Category Menu",
    description: "Clickable list of top-level product categories.",
    category: "commerce",
    icon: <ShoppingBag size={20} />,
    gradient: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    build: () => ({
      type: "Section",
      props: {
        ...SECTION_BASE_PROPS,
        content: [
          {
            type: "CategoryListMenu",
            props: {},
          },
        ],
      },
    }),
  },

  // ── Customer (DSN-005 g-j) ──────────────────────────────────────────────
  {
    id: "order-history",
    label: "Order History",
    description: "Customer account — recent orders with status.",
    category: "customer",
    icon: <UserRound size={20} />,
    gradient: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
    build: () => ({
      type: "Section",
      props: {
        ...SECTION_BASE_PROPS,
        maxWidth: "960px",
        content: [
          {
            type: "OrderHistory",
            props: {},
          },
        ],
      },
    }),
  },
  {
    id: "wishlist",
    label: "Wishlist",
    description: "Customer's saved products in a responsive grid.",
    category: "customer",
    icon: <Heart size={20} />,
    gradient: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
    build: () => ({
      type: "Section",
      props: {
        ...SECTION_BASE_PROPS,
        content: [
          {
            type: "Wishlist",
            props: {},
          },
        ],
      },
    }),
  },
  {
    id: "testimonials",
    label: "Testimonials",
    description: "Customer reviews — bilingual AR / EN supported.",
    category: "customer",
    icon: <Star size={20} />,
    gradient: "linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)",
    build: () => ({
      type: "Section",
      props: {
        ...SECTION_BASE_PROPS,
        paddingTop: "80px",
        paddingBottom: "80px",
        backgroundColor: "#fafafa",
        content: [
          {
            type: "Testimonials",
            props: {},
          },
        ],
      },
    }),
  },
  {
    id: "contact-form",
    label: "Contact Form",
    description: "Collect inquiries. Submits to tenant endpoint.",
    category: "customer",
    icon: <Mail size={20} />,
    gradient: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    build: () => ({
      type: "Section",
      props: {
        ...SECTION_BASE_PROPS,
        maxWidth: "768px",
        content: [
          {
            type: "ContactForm",
            props: {},
          },
        ],
      },
    }),
  },

  // ── Content (DSN-004) ────────────────────────────────────────────────────
  {
    id: "rich-text",
    label: "Rich Text",
    description: "Headline + paragraph, centred.",
    category: "content",
    icon: <TypeIcon size={20} />,
    gradient: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
    build: () => ({
      type: "Section",
      props: {
        ...SECTION_BASE_PROPS,
        maxWidth: "768px",
        paddingTop: "48px",
        paddingBottom: "48px",
        content: [
          {
            type: "ContentHeading",
            props: {},
          },
          {
            type: "ContentParagraph",
            props: {},
          },
        ],
      },
    }),
  },
  {
    id: "image-gallery",
    label: "Image Gallery",
    description: "Grid of images — great for lookbooks.",
    category: "content",
    icon: <Images size={20} />,
    gradient: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #ddd6fe 100%)",
    build: () => ({
      type: "Section",
      props: {
        ...SECTION_BASE_PROPS,
        content: [
          {
            type: "ImageGallery",
            props: {},
          },
        ],
      },
    }),
  },
  {
    id: "testimonial-quote",
    label: "Quote",
    description: "Single large testimonial / pull-quote.",
    category: "content",
    icon: <MessageSquareText size={20} />,
    gradient: "linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)",
    build: () => ({
      type: "Section",
      props: {
        ...SECTION_BASE_PROPS,
        maxWidth: "768px",
        paddingTop: "80px",
        paddingBottom: "80px",
        backgroundColor: "#fafafa",
        content: [
          {
            type: "Testimonials",
            props: {
              itemCount: 1,
              layoutVariant: "minimal",
            },
          },
        ],
      },
    }),
  },
];

export const CATEGORY_LABELS: Record<SectionCategory, string> = {
  hero: "Hero & Openers",
  commerce: "Commerce",
  customer: "Customer",
  content: "Content",
  layout: "Layout",
};

export const CATEGORY_ORDER: SectionCategory[] = [
  "hero",
  "commerce",
  "customer",
  "content",
  "layout",
];

/**
 * Ensure inserting a preset doesn't leak editor-only state: the returned
 * payload must be safely JSON.stringify-able. Used as a dev-time guard by
 * the Add Section modal to catch misconfigured presets.
 */
export function assertSerializable(preset: SectionPreset): void {
  const built = preset.build();
  try {
    JSON.parse(JSON.stringify(built));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(
      `[shopify-editor] Section preset "${preset.id}" is not JSON-serializable`,
      e
    );
    throw e;
  }
}

// Re-export Data for convenience of consumers that want to type-narrow
// dispatched payloads against the user's Config.
export type { Data };
