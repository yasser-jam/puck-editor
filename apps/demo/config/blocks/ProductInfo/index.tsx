import React from "react";
import { ComponentConfig } from "@/core/types";
import { getClassNameFactory } from "@/core/lib";
import { WithLayout, withLayout } from "../../components/Layout";
import {
  productExternalField,
  formatPrice,
  discountedPrice,
  type Product,
} from "../../data/products";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("ProductInfo", styles);

// ─── Types ─────────────────────────────────────────────────────────────────

export type ProductInfoProps = WithLayout<{
  product?: Product | null;

  // ── Display toggles ──
  showTitle: boolean;
  showDescription: boolean;
  showCategories: boolean;
  showPrice: boolean;
  showStockBadge: boolean;

  // ── Typography ──
  titleSize: "s" | "m" | "l" | "xl";
  priceSize: "s" | "m" | "l";

  // ── Layout ──
  align: "left" | "center" | "right";
  padding: "none" | "sm" | "md" | "lg";
}>;

// ─── Config ────────────────────────────────────────────────────────────────

const ProductInfoInner: ComponentConfig<ProductInfoProps> = {
  label: "Product Info",

  fields: {
    product: productExternalField,

    // ── Display toggles ──
    showTitle: {
      type: "radio",
      label: "Title",
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false },
      ],
    },
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
    showPrice: {
      type: "radio",
      label: "Price",
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

    // ── Typography ──
    titleSize: {
      type: "select",
      label: "Title Size",
      options: [
        { label: "S", value: "s" },
        { label: "M", value: "m" },
        { label: "L", value: "l" },
        { label: "XL", value: "xl" },
      ],
    },
    priceSize: {
      type: "select",
      label: "Price Size",
      options: [
        { label: "S", value: "s" },
        { label: "M", value: "m" },
        { label: "L", value: "l" },
      ],
    },

    // ── Layout ──
    align: {
      type: "radio",
      label: "Align",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    padding: {
      type: "radio",
      label: "Padding",
      options: [
        { label: "None", value: "none" },
        { label: "S", value: "sm" },
        { label: "M", value: "md" },
        { label: "L", value: "lg" },
      ],
    },
  },

  defaultProps: {
    product: null,
    showTitle: true,
    showDescription: true,
    showCategories: true,
    showPrice: true,
    showStockBadge: true,
    titleSize: "m",
    priceSize: "m",
    align: "left",
    padding: "md",
    layout: { grow: true },
  },

  render: ({
    product,
    showTitle,
    showDescription,
    showCategories,
    showPrice,
    showStockBadge,
    titleSize,
    priceSize,
    align,
    padding,
  }) => {
    if (!product) {
      return (
        <div className={getClassName("empty")}>No product selected</div>
      );
    }

    const hasDiscount =
      typeof product.discount === "number" && product.discount > 0;
    const finalPrice = hasDiscount
      ? discountedPrice(product.price, product.discount!)
      : product.price;

    return (
      <div
        className={getClassName({
          [`--titleSize-${titleSize}`]: true,
          [`--priceSize-${priceSize}`]: true,
          [`--align-${align}`]: true,
          [`--padding-${padding}`]: true,
        })}
      >
        {/* Categories */}
        {showCategories && product.categories.length > 0 && (
          <div className={getClassName("categories")}>
            {product.categories.map((cat) => (
              <span key={cat} className={getClassName("category")}>
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        {showTitle && (
          <h3 className={getClassName("title")}>{product.title}</h3>
        )}

        {/* Description */}
        {showDescription && (
          <p className={getClassName("description")}>{product.description}</p>
        )}

        {/* Price */}
        {showPrice && (
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
                  -{product.discount}%
                </span>
              </>
            )}
          </div>
        )}

        {/* Stock badge */}
        {showStockBadge && (
          <span
            className={getClassName("stockBadge", {
              "stockBadge--inStock": product.inStock,
              "stockBadge--outOfStock": !product.inStock,
            })}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        )}
      </div>
    );
  },
};

export const ProductInfo = withLayout(ProductInfoInner);
