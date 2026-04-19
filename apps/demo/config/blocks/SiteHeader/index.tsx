import React from "react";
import { ComponentConfig } from "@/core/types";
import { colorField } from "../../fields/ColorField";
import { EMPTY_LINK, linkField } from "../../fields/LinkField";
import {
  Header,
  DEFAULT_HEADER_LINKS,
  type HeaderDrawerIcon,
  type HeaderLink,
} from "../../components/Header";
import type { ShellVariant } from "../../theme";

export type SiteHeaderProps = {
  title: string;
  variant: ShellVariant;
  language: "ar" | "en";
  visible: boolean;
  brandHref: string;
  links: HeaderLink[];
  backgroundColor: string;
  textColor: string;
  showDrawerButton: boolean;
  drawerButtonIcon: HeaderDrawerIcon;
  drawerName: string;
};

export const SiteHeader: ComponentConfig<SiteHeaderProps> = {
  label: "Site Header",
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
    brandHref: {
      type: "text",
      label: "Brand link",
      placeholder: "/",
    },
    links: {
      type: "array",
      label: "Navigation links",
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
    showDrawerButton: {
      type: "radio",
      label: "Show drawer button",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    drawerButtonIcon: {
      type: "select",
      label: "Drawer icon",
      options: [
        { label: "Menu", value: "menu" },
        { label: "Filter", value: "filter" },
        { label: "Cart", value: "cart" },
        { label: "User", value: "user" },
        { label: "Hide", value: "none" },
      ],
    },
    drawerName: {
      type: "text",
      label: "Drawer name",
      placeholder: "site-drawer",
    },
  },
  defaultProps: {
    title: "متجري على SOOQ",
    variant: "commerce",
    language: "ar",
    visible: true,
    brandHref: "/",
    links: DEFAULT_HEADER_LINKS,
    backgroundColor: "",
    textColor: "",
    showDrawerButton: false,
    drawerButtonIcon: "menu",
    drawerName: "site-drawer",
  },
  render: ({
    title,
    variant,
    language,
    visible,
    brandHref,
    links,
    backgroundColor,
    textColor,
    showDrawerButton,
    drawerButtonIcon,
    drawerName,
    puck,
  }) => {
    return (
      <Header
        editMode={!!puck.isEditing}
        variant={variant}
        siteTitle={title}
        links={links}
        language={language}
        visible={visible}
        brandHref={brandHref}
        backgroundColor={backgroundColor || undefined}
        textColor={textColor || undefined}
        showDrawerButton={showDrawerButton}
        drawerButtonIcon={drawerButtonIcon}
        drawerName={drawerName || "site-drawer"}
      />
    );
  },
};
