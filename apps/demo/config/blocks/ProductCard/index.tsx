/* eslint-disable @next/next/no-img-element */
import React, { CSSProperties } from "react";
import { ComponentConfig } from "@/core/types";
import { getClassNameFactory } from "@/core/lib";
import { WithLayout, withLayout } from "../../components/Layout";
import { products, type Product } from "../../data/products";
import { AdvancedModal, AdvancedStyleProps, DEFAULT_ADVANCED } from "./AdvancedModal";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("ProductCard", styles);

// ─── Types ──────────────────────────────────────────────────────────────────

export type ProductCardProps = WithLayout<{
  product: Product | null;
  variant: "vertical" | "horizontal" | "compact" | "featured";
  colorScheme: "light" | "dark" | "transparent";
  imageAspectRatio: "square" | "landscape" | "portrait";
  spacing: "compact" | "normal" | "relaxed";
  showDescription: boolean;
  showCategories: boolean;
  showBadge: boolean;
  showStockBadge: boolean;
  advanced: AdvancedStyleProps;
}>;

// Re-export AdvancedStyleProps for types.ts
export type { AdvancedStyleProps };

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

// ─── Render ──────────────────────────────────────────────────────────────────

function ProductCardRender({
  product,
  variant,
  colorScheme,
  imageAspectRatio,
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

  // Build inline CSS custom-property overrides from advanced settings.
  // Only set a property when the user has provided a non-empty value so the
  // scheme-class fallbacks remain in effect for unset fields.
  const cssVars: CSSProperties = {
    ...(advanced.backgroundColor && { "--pc-bg": advanced.backgroundColor }),
    ...(advanced.textColor && { "--pc-text": advanced.textColor }),
    ...(advanced.accentColor && { "--pc-accent": advanced.accentColor }),
    ...(advanced.priceColor && { "--pc-price": advanced.priceColor }),
    ...(advanced.borderColor && { "--pc-border-color": advanced.borderColor }),
    ...(advanced.titleFontSize && { "--pc-title-size": advanced.titleFontSize }),
    ...(advanced.titleFontWeight && {
      "--pc-title-weight": advanced.titleFontWeight,
    }),
    ...(advanced.descriptionFontSize && {
      "--pc-desc-size": advanced.descriptionFontSize,
    }),
    ...(advanced.priceFontSize && { "--pc-price-size": advanced.priceFontSize }),
    ...(advanced.borderRadius && { "--pc-radius": advanced.borderRadius }),
    ...(advanced.cardPadding && { "--pc-padding": advanced.cardPadding }),
    ...(advanced.contentGap && { "--pc-gap": advanced.contentGap }),
    ...(advanced.imageWidth && { "--pc-image-width": advanced.imageWidth }),
    ...(advanced.borderWidth && { "--pc-border-width": advanced.borderWidth }),
    ...(advanced.boxShadow && { "--pc-shadow": advanced.boxShadow }),
  } as CSSProperties;

  // Description line-clamp style applied directly on the <p> element.
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

  // Compact layout always uses a square image; featured locks to portrait.
  // Otherwise respect the user's imageAspectRatio selection.
  const effectiveRatio =
    variant === "compact"
      ? "square"
      : variant === "featured"
      ? "portrait"
      : imageAspectRatio;

  const hideDescription = variant === "compact" || !showDescription;

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
        <div
          className={`${getClassName("imageWrapper")} ${getClassName(
            `imageWrapper--${effectiveRatio}`
          )}`}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className={getClassName("image")}
            />
          ) : (
            <div className={getClassName("placeholder")}>No image</div>
          )}

          {/* Badges overlaid on image */}
          <div className={getClassName("badges")}>
            {showBadge && hasDiscount && (
              <span
                className={`${getClassName("badge")} ${getClassName(
                  "badge--discount"
                )}`}
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

    // ── Image ──
    imageAspectRatio: {
      type: "radio",
      label: "Image Ratio",
      options: [
        { label: "Square", value: "square" },
        { label: "4:3", value: "landscape" },
        { label: "3:4", value: "portrait" },
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
    variant: "vertical",
    colorScheme: "light",
    imageAspectRatio: "landscape",
    spacing: "normal",
    showDescription: true,
    showCategories: true,
    showBadge: true,
    showStockBadge: true,
    advanced: { ...DEFAULT_ADVANCED },
  },

  render: ProductCardRender,
};

export const ProductCard = withLayout(ProductCardInner);
