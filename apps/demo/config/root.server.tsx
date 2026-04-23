import React from "react";
import { RootConfig } from "@/core";
import type { RootProps } from "./root";

const Root: RootConfig<{
  props: RootProps;
  fields: {
    userField: { type: "userField"; option: boolean };
  };
}> = {
  fields: {
    title: {
      type: "text",
      label: "Page title",
    },
  } as any,
  defaultProps: {
    title: "متجري على SOOQ",
    direction: "rtl",
    language: "ar",
  } as Partial<RootProps>,
  render: ({ children, direction = "rtl", language = "ar" }) => (
    <div dir={direction} lang={language}>
      {children}
    </div>
  ),
};

export default Root;
