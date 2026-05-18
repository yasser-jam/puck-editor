"use client";

import { AutoField, Button, FieldLabel, Puck, Render } from "@/core";
import headingAnalyzer from "@/plugin-heading-analyzer/src/HeadingAnalyzer";
import config from "../../config";
import { useDemoData } from "../../lib/use-demo-data";
import { useEffect, useMemo, useState } from "react";
import { CircleHelp, Keyboard, MousePointer2, Type, X } from "lucide-react";
import { settingsPlugin } from "../../config/plugins/settings";
import { HtmlBlockPaletteSync } from "../../config/plugins/html-block-palette";
import { ThemeInjector } from "../../config/plugins/settings/ThemeInjector";
import { pagesPlugin } from "../../config/plugins/pages";
import { themesPlugin } from "../../config/plugins/themes";
import { shopifyOutlinePlugin } from "../../config/plugins/shopify-editor";
import { canvasInteractionsPlugin } from "../../config/plugins/canvas-interactions";
import { normalizeEditorData } from "../../lib/normalize-editor-data";

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tagName = target.tagName;
  return tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";
};

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
  const [isShortcutDialogOpen, setShortcutDialogOpen] = useState(false);

  const modKeyLabel = useMemo(() => {
    if (typeof navigator === "undefined") return "Ctrl";
    return /Mac|iPhone|iPad/.test(navigator.platform) ? "Cmd" : "Ctrl";
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !isEdit) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShortcutDialogOpen(false);
        return;
      }

      if (isTypingTarget(event.target)) return;

      const isQuestionShortcut =
        event.key === "?" || (event.key === "/" && event.shiftKey);

      if (!isQuestionShortcut) return;

      event.preventDefault();
      setShortcutDialogOpen((previous) => !previous);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isClient, isEdit]);

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

                {isShortcutDialogOpen ? (
                  <div
                    className="EditorShortcutOverlay"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Puck editor shortcuts"
                    data-puck-no-shortcuts="true"
                  >
                    <button
                      type="button"
                      className="EditorShortcutOverlayBackdrop"
                      onClick={() => setShortcutDialogOpen(false)}
                      aria-label="Close shortcuts panel"
                    />

                    <div
                      className="EditorShortcutDialog"
                      data-puck-no-shortcuts="true"
                    >
                      <div className="EditorShortcutDialogHeader">
                        <div>
                          <p className="EditorShortcutEyebrow">Editor guide</p>
                          <h2 className="EditorShortcutTitle">
                            Build faster with shortcuts
                          </h2>
                        </div>

                        <button
                          type="button"
                          className="EditorShortcutClose"
                          onClick={() => setShortcutDialogOpen(false)}
                          aria-label="Close editor guide"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="EditorShortcutSections">
                        <section className="EditorShortcutSection">
                          <h3>
                            <Keyboard size={16} />
                            Core actions
                          </h3>
                          <ul>
                            <li>
                              <span>Add section</span>
                              <kbd>A</kbd>
                            </li>
                            <li>
                              <span>Insert Hero on an empty page</span>
                              <span className="EditorShortcutKeys">
                                <kbd>Shift</kbd>
                                <kbd>A</kbd>
                              </span>
                            </li>
                            <li>
                              <span>Open this guide</span>
                              <kbd>?</kbd>
                            </li>
                            <li>
                              <span>Close dialogs</span>
                              <kbd>Esc</kbd>
                            </li>
                          </ul>
                        </section>

                        <section className="EditorShortcutSection">
                          <h3>
                            <MousePointer2 size={16} />
                            Canvas editing
                          </h3>
                          <ul>
                            <li>
                              <span>Duplicate selected block</span>
                              <span className="EditorShortcutKeys">
                                <kbd>{modKeyLabel}</kbd>
                                <kbd>D</kbd>
                              </span>
                            </li>
                            <li>
                              <span>Copy or paste block</span>
                              <span className="EditorShortcutKeys">
                                <kbd>{modKeyLabel}</kbd>
                                <kbd>C</kbd>
                                <kbd>{modKeyLabel}</kbd>
                                <kbd>V</kbd>
                              </span>
                            </li>
                            <li>
                              <span>Move block up or down</span>
                              <span className="EditorShortcutKeys">
                                <kbd>{modKeyLabel}</kbd>
                                <kbd>↑</kbd>
                                <kbd>{modKeyLabel}</kbd>
                                <kbd>↓</kbd>
                              </span>
                            </li>
                            <li>
                              <span>Hide or show selected block</span>
                              <kbd>H</kbd>
                            </li>
                            <li>
                              <span>Delete selected block</span>
                              <kbd>Del</kbd>
                            </li>
                          </ul>
                        </section>
                      </div>

                      <p className="EditorShortcutFooter">
                        Tip: Right-click any block on the canvas to open the
                        quick action menu.
                      </p>

                      <div className="EditorShortcutActions">
                        <button
                          type="button"
                          className="EditorShortcutGhostButton"
                          onClick={() => {
                            setShortcutDialogOpen(false);
                          }}
                        >
                          Close guide
                        </button>

                        <button
                          type="button"
                          className="EditorShortcutPrimaryButton"
                          onClick={() => setShortcutDialogOpen(false)}
                        >
                          Continue editing
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
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
                <div className="EditorHeaderActions">
                  <div className="EditorHeaderContext" title={`Editing ${path}`}>
                    <span className="EditorHeaderContextLabel">Editing</span>
                    <code className="EditorHeaderContextPath">{path}</code>
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShortcutDialogOpen(true)}
                    icon={<CircleHelp size={14} />}
                  >
                    Shortcuts
                  </Button>

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
