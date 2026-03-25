/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ComponentConfig } from "@/core/types";
import { getClassNameFactory } from "@/core/lib";
import { WithLayout, withLayout } from "../../components/Layout";
import { products, type Product } from "../../data/products";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("ProductCard", styles);

// ─── Typing ────────────────────────────────────────────────────────────────

export type ProductCardProps = WithLayout<{
  /** The selected product data (populated by the external field). */
  product?: Product | null;

  // ── Typography ──
  titleSize: "s" | "m" | "l" | "xl";
  priceSize: "s" | "m" | "l";

  // ── Spacing ──
  spacing: "compact" | "normal" | "relaxed";

  // ── Image ──
  imageAspectRatio: "square" | "landscape" | "portrait";

  // ── Display toggles ──
  showDescription: boolean;
  showCategories: boolean;
  showStockBadge: boolean;
}>;

// ─── Helpers ───────────────────────────────────────────────────────────────

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

// ─── Render ────────────────────────────────────────────────────────────────

function ProductCardRender({
  product,
  titleSize,
  priceSize,
  spacing,
  imageAspectRatio,
  showDescription,
  showCategories,
  showStockBadge,
}: ProductCardProps) {
  if (!product) {
    return (
      <div className={getClassName("empty")}>
        No product selected. Choose one from the Fields panel.
      </div>
    );
  }

  const hasDiscount = typeof product.discount === "number" && product.discount > 0;
  const finalPrice = hasDiscount
    ? discountedPrice(product.price, product.discount!)
    : product.price;

  return (
    <div
      className={getClassName({
        [`titleSize-${titleSize}`]: true,
        [`priceSize-${priceSize}`]: true,
        [`spacing-${spacing}`]: spacing !== "normal",
      })}
    >
      <div className={getClassName("inner")}>
        {/* ─ Image ─ */}
        <div
          className={getClassName("imageWrapper", {
            [`imageWrapper--${imageAspectRatio}`]: true,
          })}
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

          {/* ─ Badges ─ */}
          <div className={getClassName("badges")}>
            {hasDiscount && (
              <span className={getClassName("badge", { "badge--discount": true })}>
                -{product.discount}%
              </span>
            )}
            {showStockBadge && (
              <span
                className={getClassName("badge", {
                  "badge--inStock": product.inStock,
                  "badge--outOfStock": !product.inStock,
                })}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            )}
          </div>
        </div>

        {/* ─ Body ─ */}
        <div className={getClassName("body")}>
          {showCategories && product.categories.length > 0 && (
            <div className={getClassName("categories")}>
              {product.categories.map((cat) => (
                <span key={cat} className={getClassName("category")}>
                  {cat}
                </span>
              ))}
            </div>
          )}

          <h3 className={getClassName("title")}>{product.title}</h3>

          {showDescription && (
            <p className={getClassName("description")}>{product.description}</p>
          )}

          {/* ─ Price ─ */}
          <div className={getClassName("priceRow")}>
            <span className={getClassName("price")}>{formatPrice(finalPrice)}</span>
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

// ─── Component Config ──────────────────────────────────────────────────────

const ProductCardInner: ComponentConfig<ProductCardProps> = {
  label: "Product Card",
  fields: {
    product: {
      type: "external",
      label: "Product",
      placeholder: "Search or select a product…",
      showSearch: true,
      fetchList: async ({ query }) => {
        await new Promise((res) => setTimeout(res, 120)); // simulate async lookup
        const q = query.toLowerCase();
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

    // ── Typography ──
    titleSize: {
      type: "select",
      label: "Title Size",
      options: [
        { label: "Small", value: "s" },
        { label: "Medium", value: "m" },
        { label: "Large", value: "l" },
        { label: "X-Large", value: "xl" },
      ],
    },
    priceSize: {
      type: "select",
      label: "Price Size",
      options: [
        { label: "Small", value: "s" },
        { label: "Medium", value: "m" },
        { label: "Large", value: "l" },
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

    // ── Toggles ──
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
    showStockBadge: {
      type: "radio",
      label: "Stock Badge",
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false },
      ],
    },
  },

  defaultProps: {
    product: products[0],
    titleSize: "m",
    priceSize: "m",
    spacing: "normal",
    imageAspectRatio: "landscape",
    showDescription: true,
    showCategories: true,
    showStockBadge: true,
  },

  render: ProductCardRender,
};

export const ProductCard = withLayout(ProductCardInner);
