/* eslint-disable @next/next/no-img-element */
import React, { CSSProperties } from "react";
import { ComponentConfig } from "@/core/types";
import { getClassNameFactory } from "@/core/lib";
import { WithLayout, withLayout } from "../../components/Layout";
import { products, type Product } from "../../data/products";
import { AdvancedModal, AdvancedStyleProps, DEFAULT_ADVANCED } from "./AdvancedModal";
import { COMPONENT_FONT_OPTIONS, COMPONENT_FONT_CSS } from "../../theme";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("ProductCard", styles);

// ─── Types ──────────────────────────────────────────────────────────────────

export type ProductCardProps = WithLayout<{
  product: Product | null;
  variant: "vertical" | "horizontal" | "compact" | "featured";
  colorScheme: "light" | "dark" | "transparent";

  // ── Typography ──
  fontFamily: "body" | "option1" | "option2";
  fontWeight: "300" | "400" | "500" | "600" | "700";
  lineHeight: "tight" | "normal" | "relaxed";

  // ── Image ──
  imageMode: "img" | "background";
  imageHeight: string;                   // CSS value e.g. "260px", "40vh"
  imageBorderRadius: "none" | "sm" | "md" | "lg" | "pill";
  // img-mode only:
  imageObjectFit: "cover" | "contain" | "fill" | "none";
  // background-mode only:
  imageBackgroundSize: "cover" | "contain" | "auto";
  imageBackgroundPosition: string;
  imageBackgroundAttachment: "scroll" | "fixed" | "local";

  // ── Spacing ──
  spacing: "compact" | "normal" | "relaxed";

  // ── Display toggles ──
  showDescription: boolean;
  showCategories: boolean;
  showBadge: boolean;
  showStockBadge: boolean;

  // ── Advanced ──
  advanced: AdvancedStyleProps;
}>;

// Re-export for types.ts
export type { AdvancedStyleProps };

// ─── Lookup maps ─────────────────────────────────────────────────────────────

// Font family: reference CSS custom properties set by the theme so that
// changes in the Settings panel update all cards on the page instantly.
const FONT_FAMILY_MAP: Record<string, string> = COMPONENT_FONT_CSS;

const LINE_HEIGHT_MAP: Record<string, string> = {
  tight: "1.2",
  normal: "1.5",
  relaxed: "1.75",
};

const IMG_BORDER_RADIUS_MAP: Record<string, string> = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "16px",
  pill: "9999px",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
}

function discountedPrice(price: number, discount: number): number {
  return price * (1 - discount / 100);
}

// ─── Default props (shared with ProductsGrid nested cards) ─────────────────

export const DEFAULT_PRODUCT_CARD_PROPS: Omit<
  ProductCardProps,
  "product" | "layout"
> = {
  variant: "vertical",
  colorScheme: "light",
  fontFamily: "body",
  fontWeight: "400",
  lineHeight: "normal",
  imageMode: "img",
  imageHeight: "",
  imageBorderRadius: "none",
  imageObjectFit: "cover",
  imageBackgroundSize: "cover",
  imageBackgroundPosition: "center",
  imageBackgroundAttachment: "scroll",
  spacing: "normal",
  showDescription: true,
  showCategories: true,
  showBadge: true,
  showStockBadge: true,
  advanced: { ...DEFAULT_ADVANCED },
};

// ─── Render ──────────────────────────────────────────────────────────────────

export function ProductCardRender({
  product,
  variant,
  colorScheme,
  fontFamily,
  fontWeight,
  lineHeight,
  imageMode,
  imageHeight,
  imageBorderRadius,
  imageObjectFit,
  imageBackgroundSize,
  imageBackgroundPosition,
  imageBackgroundAttachment,
  spacing,
  showDescription,
  showCategories,
  showBadge,
  showStockBadge,
  advanced,
}: ProductCardProps) {
  if (!product) {
    return (
      <div className={getClassName("empty")}>
        No product selected — choose one from the Fields panel.
      </div>
    );
  }

  const hasDiscount =
    typeof product.discount === "number" && product.discount > 0;
  const finalPrice = hasDiscount
    ? discountedPrice(product.price, product.discount!)
    : product.price;

  // ── CSS custom property overrides ──
  // Basic panel → CSS vars (always applied)
  const basicVars: CSSProperties = {
    "--pc-font-family": FONT_FAMILY_MAP[fontFamily] ?? "inherit",
    "--pc-base-weight": fontWeight,
    "--pc-line-height": LINE_HEIGHT_MAP[lineHeight] ?? "1.5",
    "--pc-img-h": imageHeight || undefined,
    "--pc-img-radius": IMG_BORDER_RADIUS_MAP[imageBorderRadius] ?? "0px",
  } as CSSProperties;

  // Advanced modal → CSS vars (only when non-empty, override scheme defaults)
  const advancedVars: CSSProperties = {
    ...(advanced.backgroundColor && { "--pc-bg": advanced.backgroundColor }),
    ...(advanced.textColor && { "--pc-text": advanced.textColor }),
    ...(advanced.accentColor && { "--pc-accent": advanced.accentColor }),
    ...(advanced.priceColor && { "--pc-price": advanced.priceColor }),
    ...(advanced.borderColor && { "--pc-border-color": advanced.borderColor }),
    ...(advanced.titleFontSize && { "--pc-title-size": advanced.titleFontSize }),
    ...(advanced.titleFontWeight && { "--pc-title-weight": advanced.titleFontWeight }),
    ...(advanced.descriptionFontSize && { "--pc-desc-size": advanced.descriptionFontSize }),
    ...(advanced.priceFontSize && { "--pc-price-size": advanced.priceFontSize }),
    ...(advanced.borderRadius && { "--pc-radius": advanced.borderRadius }),
    ...(advanced.cardPadding && { "--pc-padding": advanced.cardPadding }),
    ...(advanced.contentGap && { "--pc-gap": advanced.contentGap }),
    ...(advanced.imageWidth && { "--pc-image-width": advanced.imageWidth }),
    ...(advanced.borderWidth && { "--pc-border-width": advanced.borderWidth }),
    ...(advanced.boxShadow && { "--pc-shadow": advanced.boxShadow }),
  } as CSSProperties;

  const cssVars: CSSProperties = { ...basicVars, ...advancedVars };

  // Description line-clamp
  const descClamp = advanced.descriptionLineClamp;
  const descStyle: CSSProperties =
    descClamp > 0
      ? {
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: descClamp,
          WebkitBoxOrient: "vertical" as const,
        }
      : {};

  const hideDescription = variant === "compact" || !showDescription;

  // Image element — <img> or CSS background-image div
  const imageEl = product.image ? (
    imageMode === "background" ? (
      <div
        className={getClassName("imageBg")}
        style={{
          backgroundImage: `url(${product.image})`,
          backgroundSize: imageBackgroundSize || "cover",
          backgroundPosition: imageBackgroundPosition || "center",
          backgroundAttachment: imageBackgroundAttachment || "scroll",
        }}
        aria-label={product.title}
      />
    ) : (
      <img
        src={product.image}
        alt={product.title}
        className={getClassName("image")}
        style={{ objectFit: imageObjectFit || "cover" }}
      />
    )
  ) : (
    <div className={getClassName("placeholder")}>No image</div>
  );

  return (
    <div
      className={[
        getClassName({ [`scheme-${colorScheme}`]: true }),
        getClassName({ [`layout-${variant}`]: true }),
        spacing !== "normal" ? getClassName({ [`spacing-${spacing}`]: true }) : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={cssVars}
    >
      <div className={getClassName("inner")}>
        {/* ─── Image area ─── */}
        <div className={getClassName("imageWrapper")}>
          {imageEl}

          {/* Badges overlaid on image */}
          <div className={getClassName("badges")}>
            {showBadge && hasDiscount && (
              <span
                className={`${getClassName("badge")} ${getClassName("badge--discount")}`}
              >
                -{product.discount}%
              </span>
            )}
            {showStockBadge && (
              <span
                className={`${getClassName("badge")} ${getClassName(
                  product.inStock ? "badge--inStock" : "badge--outOfStock"
                )}`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            )}
          </div>
        </div>

        {/* ─── Body ─── */}
        <div className={getClassName("body")}>
          {showCategories &&
            variant !== "compact" &&
            product.categories.length > 0 && (
              <div className={getClassName("categories")}>
                {product.categories.map((cat) => (
                  <span key={cat} className={getClassName("category")}>
                    {cat}
                  </span>
                ))}
              </div>
            )}

          <h3 className={getClassName("title")}>{product.title}</h3>

          {!hideDescription && (
            <p className={getClassName("description")} style={descStyle}>
              {product.description}
            </p>
          )}

          <div className={getClassName("priceRow")}>
            <span className={getClassName("price")}>
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className={getClassName("originalPrice")}>
                  {formatPrice(product.price)}
                </span>
                <span className={getClassName("discountLabel")}>
                  Save {product.discount}%
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Component Config ─────────────────────────────────────────────────────────

const ProductCardInner: ComponentConfig<ProductCardProps> = {
  label: "Product Card",

  fields: {
    product: {
      type: "external",
      label: "Product",
      placeholder: "Search or select a product…",
      showSearch: true,
      fetchList: async ({ query }) => {
        await new Promise((res) => setTimeout(res, 80));
        const q = (query ?? "").toLowerCase();
        return products
          .filter(
            (p) =>
              !q ||
              p.title.toLowerCase().includes(q) ||
              p.categories.some((c) => c.toLowerCase().includes(q)) ||
              p.collections.some((c) => c.toLowerCase().includes(q))
          )
          .map((p) => ({
            id: p.id,
            title: p.title,
            price: `$${p.price.toFixed(2)}`,
            inStock: p.inStock ? "Yes" : "No",
            categories: p.categories.join(", "),
          }));
      },
      mapRow: (item) => ({
        title: item.title,
        price: item.price,
        inStock: item.inStock,
        categories: item.categories,
      }),
      mapProp: (row) => products.find((p) => p.title === row.title) ?? null,
      getItemSummary: (item) => (item as unknown as Product)?.title ?? "Product",
    },

    // ── Layout variant ──
    variant: {
      type: "radio",
      label: "Layout",
      options: [
        { label: "Vertical", value: "vertical" },
        { label: "Horizontal", value: "horizontal" },
        { label: "Compact", value: "compact" },
        { label: "Featured", value: "featured" },
      ],
    },

    // ── Color scheme ──
    colorScheme: {
      type: "radio",
      label: "Color Scheme",
      options: [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
        { label: "Transparent", value: "transparent" },
      ],
    },

    // ── Typography ──
    fontFamily: {
      type: "select",
      label: "Font Family",
      options: COMPONENT_FONT_OPTIONS,
    },
    fontWeight: {
      type: "radio",
      label: "Font Weight",
      options: [
        { label: "300", value: "300" },
        { label: "400", value: "400" },
        { label: "500", value: "500" },
        { label: "600", value: "600" },
        { label: "700", value: "700" },
      ],
    },
    lineHeight: {
      type: "radio",
      label: "Line Height",
      options: [
        { label: "Tight", value: "tight" },
        { label: "Normal", value: "normal" },
        { label: "Relaxed", value: "relaxed" },
      ],
    },

    // ── Image ──
    imageMode: {
      type: "radio",
      label: "Image Display",
      options: [
        { label: "Image", value: "img" },
        { label: "Background", value: "background" },
      ],
    },
    imageHeight: {
      type: "text",
      label: "Image Height (e.g. 260px, 40vh)",
    },
    imageBorderRadius: {
      type: "radio",
      label: "Image Corner Radius",
      options: [
        { label: "None", value: "none" },
        { label: "S", value: "sm" },
        { label: "M", value: "md" },
        { label: "L", value: "lg" },
        { label: "Pill", value: "pill" },
      ],
    },
    // img-mode: object-fit
    imageObjectFit: {
      type: "radio",
      label: "Object Fit",
      options: [
        { label: "Cover", value: "cover" },
        { label: "Contain", value: "contain" },
        { label: "Fill", value: "fill" },
        { label: "None", value: "none" },
      ],
    },
    // background-mode: background CSS properties
    imageBackgroundSize: {
      type: "radio",
      label: "Background Size",
      options: [
        { label: "Cover", value: "cover" },
        { label: "Contain", value: "contain" },
        { label: "Auto", value: "auto" },
      ],
    },
    imageBackgroundPosition: {
      type: "select",
      label: "Background Position",
      options: [
        { label: "Center", value: "center" },
        { label: "Top", value: "top" },
        { label: "Bottom", value: "bottom" },
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
        { label: "Top Left", value: "top left" },
        { label: "Top Right", value: "top right" },
        { label: "Bottom Left", value: "bottom left" },
        { label: "Bottom Right", value: "bottom right" },
        { label: "Top Center", value: "top center" },
        { label: "Bottom Center", value: "bottom center" },
      ],
    },
    imageBackgroundAttachment: {
      type: "radio",
      label: "Background Attachment",
      options: [
        { label: "Scroll", value: "scroll" },
        { label: "Fixed", value: "fixed" },
        { label: "Local", value: "local" },
      ],
    },

    // ── Spacing ──
    spacing: {
      type: "radio",
      label: "Spacing",
      options: [
        { label: "Compact", value: "compact" },
        { label: "Normal", value: "normal" },
        { label: "Relaxed", value: "relaxed" },
      ],
    },

    // ── Display toggles ──
    showDescription: {
      type: "radio",
      label: "Description",
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false },
      ],
    },
    showCategories: {
      type: "radio",
      label: "Categories",
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false },
      ],
    },
    showBadge: {
      type: "radio",
      label: "Discount Badge",
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false },
      ],
    },
    showStockBadge: {
      type: "radio",
      label: "Stock Badge",
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false },
      ],
    },

    // ── Advanced customization (opens portal modal) ──
    advanced: {
      type: "custom",
      label: "Advanced Styling",
      render: ({ value, onChange }) => (
        <AdvancedModal value={value} onChange={onChange} />
      ),
    },
  },

  defaultProps: {
    product: products[0] ?? null,
    ...DEFAULT_PRODUCT_CARD_PROPS,
  },

  render: ProductCardRender,
};

// ─── Wrap with layout + compose resolveFields ─────────────────────────────────
// withLayout overwrites resolveFields, so we post-process it here to add
// conditional field visibility based on imageMode.

const WithLayoutCard = withLayout(ProductCardInner);

export const ProductCard: typeof WithLayoutCard = {
  ...WithLayoutCard,
  resolveFields: (data, params) => {
    // Get base fields from withLayout's resolveFields
    const base = (WithLayoutCard as any).resolveFields!(data, params) as Record<string, unknown>;
    const mode = (data as any).props?.imageMode as string | undefined;

    if (mode === "img") {
      // Hide background-only fields
      const { imageBackgroundSize, imageBackgroundPosition, imageBackgroundAttachment, ...rest } = base;
      return rest as any;
    }
    if (mode === "background") {
      // Hide img-only fields
      const { imageObjectFit, ...rest } = base;
      return rest as any;
    }
    return base as any;
  },
};
