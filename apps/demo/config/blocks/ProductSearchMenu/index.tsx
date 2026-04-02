import React from "react";
import { ComponentConfig } from "@/core/types";
import { withLayout } from "../../components/Layout";
import { ProductSearchMenuClient } from "./ProductSearchMenuClient";
import type { ProductSearchMenuProps } from "./types";

export type { ProductSearchMenuProps };

const ProductSearchMenuInner: ComponentConfig<ProductSearchMenuProps> = {
  label: "Product search menu",

  fields: {
    buttonLabel: { type: "text", label: "Button label" },
    searchPlaceholder: { type: "text", label: "Search placeholder" },
    menuHeading: { type: "text", label: "Menu heading" },
    maxResults: {
      type: "number",
      label: "Max results (0 = all matches)",
      min: 0,
    },
  },

  defaultProps: {
    buttonLabel: "Search products",
    searchPlaceholder: "Search by name, category…",
    menuHeading: "Search results",
    maxResults: 12,
  },

  render: (props) => <ProductSearchMenuClient {...props} />,
};

export const ProductSearchMenu = withLayout(ProductSearchMenuInner);
