import React from "react";
import { getClassNameFactory } from "@/core/lib";
import type { ComponentConfig } from "@/core/types";
import { WithLayout, withLayout } from "../../components/Layout";
import { COMPONENT_FONT_CSS, COMPONENT_FONT_OPTIONS } from "../../theme";
import { colorField } from "../../fields/ColorField";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Accordion", styles);

type AccordionItem = {
  title: string;
  body: string;
  open: boolean;
};

export type AccordionProps = WithLayout<{
  heading: string;
  description: string;
  items: AccordionItem[];
  variant: "soft" | "outline" | "minimal";
  fontFamily: "body" | "option1" | "option2";
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderRadius: string;
}>;

const AccordionInner: ComponentConfig<AccordionProps> = {
  label: "Accordion",
  fields: {
    heading: { type: "text", label: "Heading" },
    description: { type: "textarea", label: "Description" },
    variant: {
      type: "radio",
      label: "Variant",
      options: [
        { label: "Soft", value: "soft" },
        { label: "Outline", value: "outline" },
        { label: "Minimal", value: "minimal" },
      ],
    },
    fontFamily: {
      type: "select",
      label: "Font family",
      options: COMPONENT_FONT_OPTIONS,
    },
    backgroundColor: colorField({
      label: "Background",
      description: "Leave empty to use theme defaults.",
    }),
    textColor: colorField({
      label: "Text color",
      description: "Leave empty to use theme defaults.",
    }),
    accentColor: colorField({
      label: "Accent color",
      description: "Used for the open state and focus accents.",
    }),
    borderRadius: {
      type: "text",
      label: "Border radius (CSS)",
    },
    items: {
      type: "array",
      label: "Items",
      arrayFields: {
        title: { type: "text", label: "Title" },
        body: { type: "textarea", label: "Body" },
        open: {
          type: "radio",
          label: "Start open",
          options: [
            { label: "No", value: false },
            { label: "Yes", value: true },
          ],
        },
      },
      defaultItemProps: {
        title: "Question",
        body: "Answer",
        open: false,
      },
      getItemSummary: (item: AccordionItem) => item.title || "Item",
    },
  },
  defaultProps: {
    heading: "Frequently asked questions",
    description:
      "Keep answers short and practical so shoppers can scan quickly.",
    variant: "soft",
    fontFamily: "body",
    backgroundColor: "",
    textColor: "",
    accentColor: "",
    borderRadius: "14px",
    items: [
      {
        title: "How long does shipping take?",
        body: "Most orders in Syria arrive in 2-4 business days depending on city.",
        open: true,
      },
      {
        title: "Can I pay cash on delivery?",
        body: "Yes. Cash on delivery is available for all eligible areas.",
        open: false,
      },
      {
        title: "Do you offer returns?",
        body: "You can request a return within 7 days for unused items in original condition.",
        open: false,
      },
    ],
  },
  render: ({
    heading,
    description,
    items,
    variant,
    fontFamily,
    backgroundColor,
    textColor,
    accentColor,
    borderRadius,
  }) => {
    const fontCss = COMPONENT_FONT_CSS[fontFamily] ?? COMPONENT_FONT_CSS.body;
    const paletteStyle = {
      "--Accordion-bg": backgroundColor || "#ffffff",
      "--Accordion-text": textColor || "#0f172a",
      "--Accordion-accent": accentColor || "#2563eb",
      "--Accordion-radius": borderRadius || "14px",
      fontFamily: fontCss,
    } as React.CSSProperties;

    const className = getClassName({
      soft: variant === "soft",
      outline: variant === "outline",
      minimal: variant === "minimal",
    });

    return (
      <section className={className} style={paletteStyle}>
        {heading ? (
          <h3 className={getClassName("heading")}>{heading}</h3>
        ) : null}
        {description ? (
          <p className={getClassName("description")}>{description}</p>
        ) : null}

        <div className={getClassName("list")}>
          {(items || []).map((item, index) => {
            const title = item.title || `Item ${index + 1}`;
            return (
              <details
                key={`${title}-${index}`}
                className={getClassName("item")}
                open={!!item.open}
              >
                <summary className={getClassName("summary")}>
                  <span>{title}</span>
                  <span className={getClassName("chevron")} aria-hidden />
                </summary>

                <div className={getClassName("body")}>
                  <p className={getClassName("bodyText")}>{item.body}</p>
                </div>
              </details>
            );
          })}
        </div>
      </section>
    );
  },
};

export const Accordion = withLayout(AccordionInner);
