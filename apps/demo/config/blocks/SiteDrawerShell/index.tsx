import React from "react";
import { ComponentConfig } from "@/core/types";
import { colorField } from "../../fields/ColorField";
import { EMPTY_LINK, linkField } from "../../fields/LinkField";
import {
  DEFAULT_DRAWER_LINKS,
  type SiteDrawerAnimation,
  type SiteDrawerIcon,
  type SiteDrawerLink,
  type SiteDrawerSide,
  type SiteDrawerTrigger,
} from "../../components/SiteDrawer/shared";
import {
  SiteDrawer,
} from "../../components/SiteDrawer";

export type SiteDrawerShellProps = {
  name: string;
  enabled: boolean;
  side: SiteDrawerSide;
  widthPx: number;
  animation: SiteDrawerAnimation;
  animationDurationMs: number;
  trigger: SiteDrawerTrigger;
  triggerLabel: string;
  triggerLabelAr: string;
  triggerIcon: SiteDrawerIcon;
  title: string;
  titleAr: string;
  showTitle: boolean;
  links: SiteDrawerLink[];
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  triggerBackgroundColor: string;
  triggerTextColor: string;
  overlay: boolean;
  overlayOpacityPercent: number;
  closeOnOverlayClick: boolean;
  closeOnEsc: boolean;
  showCloseButton: boolean;
  startOpen: boolean;
  showOnMobile: boolean;
  showOnDesktop: boolean;
  openOnEdgeHover: boolean;
  language: "ar" | "en";
};

export const SiteDrawerShell: ComponentConfig<SiteDrawerShellProps> = {
  label: "Side Drawer",
  permissions: {
    insert: false,
    duplicate: false,
    delete: false,
  },
  fields: {
    enabled: {
      type: "radio",
      label: "Enabled",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    name: {
      type: "text",
      label: "Drawer name",
      placeholder: "site-drawer",
    },
    language: {
      type: "radio",
      label: "Language",
      options: [
        { label: "Arabic", value: "ar" },
        { label: "English", value: "en" },
      ],
    },
    side: {
      type: "radio",
      label: "Pinned side",
      options: [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ],
    },
    widthPx: {
      type: "number",
      label: "Width (px)",
      min: 200,
      max: 720,
    },
    trigger: {
      type: "select",
      label: "Opens via",
      options: [
        { label: "Header/external trigger", value: "external" },
        { label: "Floating button", value: "floating" },
        { label: "Auto-open on page load", value: "auto" },
        { label: "None", value: "none" },
      ],
    },
    triggerLabel: {
      type: "text",
      label: "Trigger label (English)",
    },
    triggerLabelAr: {
      type: "text",
      label: "Trigger label (Arabic)",
    },
    triggerIcon: {
      type: "select",
      label: "Trigger icon",
      options: [
        { label: "Menu", value: "menu" },
        { label: "Filter", value: "filter" },
        { label: "Cart", value: "cart" },
        { label: "User", value: "user" },
        { label: "Panel", value: "panel" },
        { label: "None", value: "none" },
      ],
    },
    title: {
      type: "text",
      label: "Title (English)",
    },
    titleAr: {
      type: "text",
      label: "Title (Arabic)",
    },
    showTitle: {
      type: "radio",
      label: "Show title",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
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
    backgroundColor: colorField({ label: "Drawer background" }),
    textColor: colorField({ label: "Drawer text" }),
    accentColor: colorField({
      label: "Accent color",
      description: "Used for hover/link emphasis.",
    }),
    triggerBackgroundColor: colorField({ label: "Trigger background" }),
    triggerTextColor: colorField({ label: "Trigger text" }),
    animation: {
      type: "select",
      label: "Animation",
      options: [
        { label: "Slide", value: "slide" },
        { label: "Fade", value: "fade" },
        { label: "Scale", value: "scale" },
        { label: "None", value: "none" },
      ],
    },
    animationDurationMs: {
      type: "number",
      label: "Animation duration (ms)",
      min: 0,
      max: 2000,
    },
    overlay: {
      type: "radio",
      label: "Dim background when open",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    overlayOpacityPercent: {
      type: "number",
      label: "Overlay opacity (%)",
      min: 0,
      max: 100,
    },
    closeOnOverlayClick: {
      type: "radio",
      label: "Close on overlay click",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    closeOnEsc: {
      type: "radio",
      label: "Close on Escape",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    showCloseButton: {
      type: "radio",
      label: "Show close button",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    startOpen: {
      type: "radio",
      label: "Start open",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    showOnMobile: {
      type: "radio",
      label: "Show on mobile",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    showOnDesktop: {
      type: "radio",
      label: "Show on desktop",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    openOnEdgeHover: {
      type: "radio",
      label: "Reveal when mouse nears page edge",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
  },
  defaultProps: {
    name: "site-drawer",
    enabled: true,
    side: "left",
    widthPx: 320,
    animation: "slide",
    animationDurationMs: 260,
    trigger: "external",
    triggerLabel: "Menu",
    triggerLabelAr: "القائمة",
    triggerIcon: "menu",
    title: "Menu",
    titleAr: "القائمة",
    showTitle: true,
    links: DEFAULT_DRAWER_LINKS,
    backgroundColor: "#ffffff",
    textColor: "#111827",
    accentColor: "#2563eb",
    triggerBackgroundColor: "#ffffff",
    triggerTextColor: "#111827",
    overlay: true,
    overlayOpacityPercent: 50,
    closeOnOverlayClick: true,
    closeOnEsc: true,
    showCloseButton: true,
    startOpen: false,
    showOnMobile: true,
    showOnDesktop: true,
    openOnEdgeHover: true,
    language: "ar",
  },
  render: ({ puck, ...props }) => {
    return <SiteDrawer {...props} editMode={!!puck.isEditing} />;
  },
};
