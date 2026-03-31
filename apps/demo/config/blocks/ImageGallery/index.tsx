/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ComponentConfig } from "@/core/types";
import { WithLayout, withLayout } from "../../components/Layout";
import { MODE_OPTIONS, RADIUS_OPTIONS, resolveRadius } from "../../content/typography-fields";

export type GalleryImageItem = {
  src: string;
  alt: string;
  width: string;
  height: string;
  maxWidth: string;
  objectFit: "contain" | "cover" | "fill" | "none" | "scale-down";
  radiusMode: "theme" | "fixed";
  radiusTheme: "none" | "sm" | "md" | "lg" | "xl" | "full";
  radiusFixed: string;
};

export type ImageGalleryProps = WithLayout<{
  images: GalleryImageItem[];
  gap: string;
}>;

const defaultItem: GalleryImageItem = {
  src: "https://placehold.co/400x300/e2e8f0/64748b?text=Image",
  alt: "",
  width: "100%",
  height: "auto",
  maxWidth: "100%",
  objectFit: "cover",
  radiusMode: "theme",
  radiusTheme: "md",
  radiusFixed: "8px",
};

const ImageGalleryInner: ComponentConfig<ImageGalleryProps> = {
  label: "Image gallery",
  fields: {
    gap: { type: "text", label: "Gap between images" },
    images: {
      type: "array",
      label: "Images",
      arrayFields: {
        src: { type: "text", label: "URL" },
        alt: { type: "text", label: "Alt" },
        width: { type: "text", label: "Width" },
        height: { type: "text", label: "Height" },
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
        radiusMode: { type: "radio", label: "Radius mode", options: [...MODE_OPTIONS] },
        radiusTheme: { type: "select", options: RADIUS_OPTIONS },
        radiusFixed: { type: "text", label: "Radius (fixed)" },
      },
      defaultItemProps: defaultItem,
      getItemSummary: (item, i) => item.src?.slice(0, 40) || `Image ${(i ?? 0) + 1}`,
    },
  },
  defaultProps: {
    gap: "16px",
    images: [{ ...defaultItem }],
  },
  render: ({ images, gap }) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap,
        width: "100%",
      }}
    >
      {(images ?? []).map((item, i) => {
        const r = resolveRadius(
          item.radiusMode ?? "theme",
          item.radiusTheme ?? "md",
          item.radiusFixed ?? "8px"
        );
        return (
          <img
            key={i}
            src={item.src}
            alt={item.alt ?? ""}
            style={{
              width: item.width || "100%",
              height: item.height || "auto",
              maxWidth: item.maxWidth || "100%",
              objectFit: item.objectFit ?? "cover",
              borderRadius: r,
              display: "block",
            }}
          />
        );
      })}
    </div>
  ),
};

export const ImageGallery = withLayout(ImageGalleryInner);
