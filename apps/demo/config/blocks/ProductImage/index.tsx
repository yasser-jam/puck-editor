/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ComponentConfig } from "@/core/types";
import { getClassNameFactory } from "@/core/lib";
import { WithLayout, withLayout } from "../../components/Layout";
import {
  productExternalField,
  discountedPrice,
  type Product,
} from "../../data/products";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("ProductImage", styles);

// ─── Types ─────────────────────────────────────────────────────────────────

export type ProductImageProps = WithLayout<{
  product?: Product | null;
  aspectRatio: "square" | "landscape" | "portrait";
  /** Fixed pixel width — useful when placed beside ProductInfo in a
   *  horizontal Group. "auto" means the block fills its flex allocation. */
  width: "auto" | "120px" | "160px" | "200px" | "240px" | "280px" | "320px" | "400px";
  borderRadius: "none" | "sm" | "md" | "lg";
  showBadges: boolean;
}>;

// ─── Config ────────────────────────────────────────────────────────────────

const ProductImageInner: ComponentConfig<ProductImageProps> = {
  label: "Product Image",

  fields: {
    product: productExternalField,

    aspectRatio: {
      type: "radio",
      label: "Aspect Ratio",
      options: [
        { label: "1:1", value: "square" },
        { label: "4:3", value: "landscape" },
        { label: "3:4", value: "portrait" },
      ],
    },
    width: {
      type: "select",
      label: "Width",
      options: [
        { label: "Auto (fill)", value: "auto" },
        { label: "120px", value: "120px" },
        { label: "160px", value: "160px" },
        { label: "200px", value: "200px" },
        { label: "240px", value: "240px" },
        { label: "280px", value: "280px" },
        { label: "320px", value: "320px" },
        { label: "400px", value: "400px" },
      ],
    },
    borderRadius: {
      type: "radio",
      label: "Corner Radius",
      options: [
        { label: "None", value: "none" },
        { label: "S", value: "sm" },
        { label: "M", value: "md" },
        { label: "L", value: "lg" },
      ],
    },
    showBadges: {
      type: "radio",
      label: "Badges",
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false },
      ],
    },
  },

  defaultProps: {
    product: null,
    aspectRatio: "landscape",
    width: "auto",
    borderRadius: "sm",
    showBadges: true,
  },

  render: ({ product, aspectRatio, width, borderRadius, showBadges }) => {
    if (!product) {
      return (
        <div className={getClassName("empty")}>No product selected</div>
      );
    }

    const hasDiscount =
      typeof product.discount === "number" && product.discount > 0;

    return (
      <div
        className={getClassName({
          [`--${aspectRatio}`]: true,
          [`--radius-${borderRadius}`]: true,
        })}
        style={width !== "auto" ? { width, flexShrink: 0 } : undefined}
      >
        {product.image ? (
          <img src={product.image} alt={product.title} />
        ) : (
          <div className={getClassName("placeholder")}>No image</div>
        )}

        {showBadges && (
          <div className={getClassName("badges")}>
            {hasDiscount && (
              <span className={getClassName("badge", { "--discount": true })}>
                -{product.discount}%
              </span>
            )}
            <span
              className={getClassName("badge", {
                "--inStock": product.inStock,
                "--outOfStock": !product.inStock,
              })}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        )}
      </div>
    );
  },
};

export const ProductImage = withLayout(ProductImageInner);
