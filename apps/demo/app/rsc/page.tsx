"use client";

import config from "../../config";
import { initialData } from "../../config/initial-data";
import { Components, RootProps } from "../../config/types";

import { Config } from "@/core";
import { PuckRenderClient } from "./puck-render-client";

const conf = config as unknown as Config;

export default function Page() {
  const data = initialData["/"];
  const metadata = {
    example: "Hello, world",
  };

  return <PuckRenderClient data={data} metadata={metadata} />;
}
