import { Metadata } from "next";
import Client from "../[...puckPath]/client";

export const metadata: Metadata = {
  title: "Editing: /",
};

export default function EditRootPage() {
  return <Client isEdit path="/" />;
}

export const dynamic = "force-dynamic";
