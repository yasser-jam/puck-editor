import {
  TextSizeStep,
  RadiusStep,
  FontWeightStep,
  LineHeightStep,
  textSizeVar,
  radiusVar,
  fontWeightVar,
  lineHeightVar,
} from "../theme";

export const MODE_OPTIONS = [
  { label: "Theme", value: "theme" },
  { label: "Fixed", value: "fixed" },
] as const;

export const TEXT_SIZE_OPTIONS = (
  [
    ["xs", "XS"],
    ["sm", "SM"],
    ["md", "MD"],
    ["lg", "LG"],
    ["xl", "XL"],
    ["2xl", "2XL"],
  ] as const
).map(([value, label]) => ({ label, value: value as TextSizeStep }));

export const RADIUS_OPTIONS = (
  [
    ["none", "None"],
    ["sm", "SM"],
    ["md", "MD"],
    ["lg", "LG"],
    ["xl", "XL"],
    ["full", "Full"],
  ] as const
).map(([value, label]) => ({ label, value: value as RadiusStep }));

export const FONT_WEIGHT_OPTIONS = (
  [
    ["normal", "Normal"],
    ["medium", "Medium"],
    ["semibold", "Semibold"],
    ["bold", "Bold"],
  ] as const
).map(([value, label]) => ({ label, value: value as FontWeightStep }));

export const LINE_HEIGHT_OPTIONS = (
  [
    ["tight", "Tight"],
    ["normal", "Normal"],
    ["relaxed", "Relaxed"],
  ] as const
).map(([value, label]) => ({ label, value: value as LineHeightStep }));

export function resolveFontSize(
  mode: "theme" | "fixed",
  size: TextSizeStep,
  fixed: string
): string {
  return mode === "theme" ? textSizeVar(size) : fixed || "1rem";
}

export function resolveRadius(
  mode: "theme" | "fixed",
  size: RadiusStep,
  fixed: string
): string {
  return mode === "theme" ? radiusVar(size) : fixed || "0";
}

export function resolveFontWeight(
  mode: "theme" | "fixed",
  step: FontWeightStep,
  fixed: string
): string | number {
  return mode === "theme" ? fontWeightVar(step) : fixed || 400;
}

export function resolveLineHeight(
  mode: "theme" | "fixed",
  step: LineHeightStep,
  fixed: string
): string {
  return mode === "theme" ? lineHeightVar(step) : fixed || "1.5";
}
