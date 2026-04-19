import React from "react";
import { ComponentConfig } from "@/core/types";
import { colorField } from "../../fields/ColorField";
import { EMPTY_LINK, linkField } from "../../fields/LinkField";
import {
  Footer,
  DEFAULT_FOOTER_COLUMNS,
  DEFAULT_FOOTER_BOTTOM_LINKS,
  type FooterColumn,
  type FooterLinkData,
} from "../../components/Footer";
import type { ShellVariant } from "../../theme";

export type SiteFooterProps = {
  title: string;
  variant: ShellVariant;
  language: "ar" | "en";
  visible: boolean;
  tagline: string;
  taglineAr: string;
  showBottomBar: boolean;
  bottomBarText: string;
  bottomBarTextAr: string;
  columns: FooterColumn[];
  bottomLinks: FooterLinkData[];
  backgroundColor: string;
  textColor: string;
};

export const SiteFooter: ComponentConfig<SiteFooterProps> = {
  label: "Site Footer",
  fields: {
    title: {
      type: "text",
      label: "Brand title",
    },
    variant: {
      type: "select",
      label: "Layout variant",
      options: [
        { label: "Commerce", value: "commerce" },
        { label: "Default", value: "default" },
      ],
    },
    language: {
      type: "radio",
      label: "Language",
      options: [
        { label: "Arabic", value: "ar" },
        { label: "English", value: "en" },
      ],
    },
    visible: {
      type: "radio",
      label: "Visible",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    tagline: {
      type: "textarea",
      label: "Tagline (English)",
    },
    taglineAr: {
      type: "textarea",
      label: "Tagline (Arabic)",
    },
    showBottomBar: {
      type: "radio",
      label: "Show bottom bar",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    bottomBarText: {
      type: "text",
      label: "Bottom bar text (English)",
      placeholder: "e.g. © 2026 Meridian",
    },
    bottomBarTextAr: {
      type: "text",
      label: "Bottom bar text (Arabic)",
      placeholder: "مثال: © ٢٠٢٦ متجري",
    },
    columns: {
      type: "array",
      label: "Footer columns",
      arrayFields: {
        title: { type: "text", label: "Column title (English)" },
        titleAr: { type: "text", label: "Column title (Arabic)" },
        links: {
          type: "array",
          label: "Links",
          arrayFields: {
            label: { type: "text", label: "Label (English)" },
            labelAr: { type: "text", label: "Label (Arabic)" },
            link: linkField({ label: "Destination" }),
          },
          defaultItemProps: {
            label: "New link",
            labelAr: "عنصر",
            link: EMPTY_LINK,
          },
          getItemSummary: (item: { label?: string; href?: string }) =>
            item?.label || item?.href || "Link",
        },
      },
      defaultItemProps: {
        title: "New column",
        titleAr: "عمود جديد",
        links: [{ label: "Link", labelAr: "رابط", link: EMPTY_LINK }],
      },
      getItemSummary: (item: { title?: string }) => item?.title || "Column",
    } as any,
    bottomLinks: {
      type: "array",
      label: "Bottom links",
      arrayFields: {
        label: { type: "text", label: "Label (English)" },
        labelAr: { type: "text", label: "Label (Arabic)" },
        link: linkField({ label: "Destination" }),
      },
      defaultItemProps: {
        label: "New link",
        labelAr: "عنصر",
        link: EMPTY_LINK,
      },
      getItemSummary: (item: { label?: string; href?: string }) =>
        item?.label || item?.href || "Link",
    } as any,
    backgroundColor: colorField({
      label: "Background color",
      description: "Empty = use theme default.",
    }),
    textColor: colorField({
      label: "Text color",
      description: "Empty = use theme default.",
    }),
  },
  defaultProps: {
    title: "متجري على SOOQ",
    variant: "commerce",
    language: "ar",
    visible: true,
    tagline: "",
    taglineAr: "",
    showBottomBar: true,
    bottomBarText: "",
    bottomBarTextAr: "",
    columns: DEFAULT_FOOTER_COLUMNS,
    bottomLinks: DEFAULT_FOOTER_BOTTOM_LINKS,
    backgroundColor: "",
    textColor: "",
  },
  render: ({
    title,
    variant,
    language,
    visible,
    tagline,
    taglineAr,
    showBottomBar,
    bottomBarText,
    bottomBarTextAr,
    columns,
    bottomLinks,
    backgroundColor,
    textColor,
    puck,
  }) => {
    return (
      <Footer
        siteTitle={title}
        variant={variant}
        columns={columns}
        language={language}
        editMode={!!puck.isEditing}
        visible={visible}
        showBottomBar={showBottomBar}
        bottomBarText={bottomBarText}
        bottomBarTextAr={bottomBarTextAr}
        tagline={tagline}
        taglineAr={taglineAr}
        bottomLinks={bottomLinks}
        backgroundColor={backgroundColor || undefined}
        textColor={textColor || undefined}
      />
    );
  },
};
