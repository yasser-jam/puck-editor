import React from "react";
import { ComponentConfig } from "@/core/types";
import { WithLayout, withLayout } from "../../components/Layout";
import { MODE_OPTIONS, RADIUS_OPTIONS, resolveRadius } from "../../content/typography-fields";
import { toYouTubeEmbedUrl } from "../../content/youtube";

export type VideoEmbedProps = WithLayout<{
  src: string;
  width: string;
  height: string;
  radiusMode: "theme" | "fixed";
  radiusTheme: "none" | "sm" | "md" | "lg" | "xl" | "full";
  radiusFixed: string;
}>;

const VideoEmbedInner: ComponentConfig<VideoEmbedProps> = {
  label: "Video",
  fields: {
    src: {
      type: "textarea",
      label: "YouTube URL",
    },
    width: { type: "text", label: "Width" },
    height: { type: "text", label: "Height" },
    radiusMode: { type: "radio", label: "Border radius", options: [...MODE_OPTIONS] },
    radiusTheme: { type: "select", options: RADIUS_OPTIONS },
    radiusFixed: { type: "text", label: "Radius (fixed)" },
  },
  defaultProps: {
    src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    width: "100%",
    height: "315px",
    radiusMode: "theme",
    radiusTheme: "md",
    radiusFixed: "8px",
  },
  render: ({ src, width, height, radiusMode, radiusTheme, radiusFixed }) => {
    const embed = toYouTubeEmbedUrl(src);
    const r = resolveRadius(radiusMode, radiusTheme, radiusFixed);
    if (!embed) {
      return <div style={{ padding: "8px", color: "var(--theme-color-neutral)" }}>Add a YouTube URL</div>;
    }
    return (
      <div style={{ width: width || "100%", maxWidth: "100%" }}>
        <iframe
          title="YouTube video"
          src={embed}
          style={{
            border: "none",
            borderRadius: r,
            display: "block",
            width: width || "100%",
            height: height || "315px",
            maxWidth: "100%",
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  },
};

export const VideoEmbed = withLayout(VideoEmbedInner);
