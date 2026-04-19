"use client";

import { AutoField, Button, FieldLabel, Puck, Render } from "@/core";
import headingAnalyzer from "@/plugin-heading-analyzer/src/HeadingAnalyzer";
import config from "../../config";
import { useDemoData } from "../../lib/use-demo-data";
import { useEffect, useState } from "react";
import { Type } from "lucide-react";
import { settingsPlugin } from "../../config/plugins/settings";
import { HtmlBlockPaletteSync } from "../../config/plugins/html-block-palette";
import { ThemeInjector } from "../../config/plugins/settings/ThemeInjector";
import { pagesPlugin } from "../../config/plugins/pages";
import { themesPlugin } from "../../config/plugins/themes";
import { shopifyOutlinePlugin } from "../../config/plugins/shopify-editor";
import { canvasInteractionsPlugin } from "../../config/plugins/canvas-interactions";
import { normalizeEditorData } from "../../lib/normalize-editor-data";

export function Client({ path, isEdit }: { path: string; isEdit: boolean }) {
  const metadata = {
    example: "Hello, world",
  };

  const { data, resolvedData, key } = useDemoData({
    path,
    isEdit,
    metadata,
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const params = new URL(window.location.href).searchParams;

  if (isEdit) {
    return (
      <div>
        <Puck
          config={config}
          data={data}
          ui={{ rightSideBarVisible: false, leftSideBarVisible: true }}
          onPublish={async (data) => {
            const normalized = normalizeEditorData(data);
            localStorage.setItem(key, JSON.stringify(normalized));
          }}
          plugins={[
            shopifyOutlinePlugin,
            pagesPlugin,
            themesPlugin,
            headingAnalyzer,
            settingsPlugin,
            // Must be registered last so its `overrides.puck` wraps every
            // other plugin's — that way the context menu + keyboard shortcuts
            // sit at the outermost layer of the Puck tree and can't be
            // short-circuited by a nested override that forgets to render
            // `children`.
            canvasInteractionsPlugin,
          ]}
          // Keep the built-in Blocks palette so merchants can still drag
          // individual components (Heading, Button, ProductCard, Sidebar,
          // NavMenu, …) onto a section on the canvas. Our shopifyOutlinePlugin
          // is registered under name "outline", which by Puck's plugin-merge
          // rule replaces the built-in outline plugin while leaving "blocks"
          // untouched. Merchants now get both Shopify-style section picking
          // (via our outline + Add Section modal) AND free-form drag-and-drop
          // for leaf blocks.
          builtinPlugins={["blocks"]}
          headerPath={path}
          iframe={{
            enabled: params.get("disableIframe") === "true" ? false : true,
          }}
          fieldTransforms={{
            userField: ({ value }) => value, // Included to check types
          }}
          _experimentalFullScreenCanvas={false}
          overrides={{
            puck: ({ children }) => (
              <>
                <HtmlBlockPaletteSync />
                {children}
              </>
            ),
            // Inject theme CSS custom properties + Google Fonts into the preview iframe
            iframe: ({ children, document }) => (
              <ThemeInjector document={document}>{children}</ThemeInjector>
            ),
            fieldTypes: {
              // Example of user field provided via overrides
              userField: ({ readOnly, field, name, value, onChange }) => (
                <FieldLabel
                  label={field.label || name}
                  readOnly={readOnly}
                  icon={<Type size={16} />}
                >
                  <AutoField
                    field={{ type: "text" }}
                    onChange={onChange}
                    value={value}
                  />
                </FieldLabel>
              ),
            },
            headerActions: ({ children }) => (
              <>
                <div>
                  <Button href={path} newTab variant="secondary">
                    View page
                  </Button>
                </div>

                {children}
              </>
            ),
          }}
          metadata={metadata}
        />
      </div>
    );
  }

  if (data.content) {
    return <Render config={config} data={resolvedData} metadata={metadata} />;
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <h1>404</h1>
        <p>Page does not exist in session storage</p>
      </div>
    </div>
  );
}

export default Client;
