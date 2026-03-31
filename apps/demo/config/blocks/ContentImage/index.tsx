/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ComponentConfig } from "@/core/types";
import { WithLayout, withLayout } from "../../components/Layout";
import { MODE_OPTIONS, RADIUS_OPTIONS, resolveRadius } from "../../content/typography-fields";

export type ContentImageProps = WithLayout<{
  src: string;
  alt: string;
  width: string;
  height: string;
  maxWidth: string;
  objectFit: "contain" | "cover" | "fill" | "none" | "scale-down";
  radiusMode: "theme" | "fixed";
  radiusTheme: "none" | "sm" | "md" | "lg" | "xl" | "full";
  radiusFixed: string;
}>;

const ContentImageInner: ComponentConfig<ContentImageProps> = {
  label: "Image",
  fields: {
    src: { type: "text", label: "Image URL" },
    alt: { type: "text", label: "Alt text" },
    width: { type: "text", label: "Width (CSS, optional)" },
    height: { type: "text", label: "Height (CSS, optional)" },
    maxWidth: { type: "text", label: "Max width" },
    objectFit: {
      type: "select",
      options: [
        { label: "Cover", value: "cover" },
        { label: "Contain", value: "contain" },
        { label: "Fill", value: "fill" },
        { label: "None", value: "none" },
        { label: "Scale down", value: "scale-down" },
      ],
    },
    radiusMode: { type: "radio", label: "Border radius", options: [...MODE_OPTIONS] },
    radiusTheme: { type: "select", options: RADIUS_OPTIONS },
    radiusFixed: { type: "text", label: "Radius (fixed)" },
  },
  defaultProps: {
    src: "https://placehold.co/800x450/e2e8f0/64748b?text=Image",
    alt: "",
    width: "",
    height: "",
    maxWidth: "100%",
    objectFit: "cover",
    radiusMode: "theme",
    radiusTheme: "md",
    radiusFixed: "8px",
  },
  render: ({
    src,
    alt,
    width,
    height,
    maxWidth,
    objectFit,
    radiusMode,
    radiusTheme,
    radiusFixed,
  }) => {
    const r = resolveRadius(radiusMode, radiusTheme, radiusFixed);
    return (
      <img
        src={src}
        alt={alt}
        style={{
          display: "block",
          width: width || "100%",
          height: height || "auto",
          maxWidth: maxWidth || "100%",
          objectFit,
          borderRadius: r,
          verticalAlign: "middle",
        }}
      />
    );
  },
};

export const ContentImage = withLayout(ContentImageInner);
