import React from "react";
import { ComponentConfig } from "@/core/types";
import { withLayout } from "../../components/Layout";
import { CategoryListMenuClient } from "./CategoryListMenuClient";
import type { CategoryListMenuProps } from "./types";

export type { CategoryListMenuProps };

const CategoryListMenuInner: ComponentConfig<CategoryListMenuProps> = {
  label: "Category list menu",

  fields: {
    buttonLabel: { type: "text", label: "Button label" },
    categoriesMenuTitle: { type: "text", label: "Categories screen title" },
    backLabel: { type: "text", label: "Back button (accessibility)" },
    maxProducts: {
      type: "number",
      label: "Max products per category (0 = all)",
      min: 0,
    },
  },

  defaultProps: {
    buttonLabel: "Browse categories",
    categoriesMenuTitle: "Shop by category",
    backLabel: "Back to categories",
    maxProducts: 24,
  },

  render: (props) => <CategoryListMenuClient {...props} />,
};

export const CategoryListMenu = withLayout(CategoryListMenuInner);
