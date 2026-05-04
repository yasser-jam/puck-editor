import { Render } from "@/core/bundle/rsc";
import type { Config } from "@/core";
import type { Metadata } from "@/core/types";
import type { UserData } from "../../config/types";
import serverConfig from "../../config/server";

const conf = serverConfig as unknown as Config;

type Props = {
  data: UserData;
  metadata?: Metadata;
};

export function PuckRenderClient({ data, metadata = {} }: Props) {
  return <Render config={conf} data={data} metadata={metadata} />;
}
