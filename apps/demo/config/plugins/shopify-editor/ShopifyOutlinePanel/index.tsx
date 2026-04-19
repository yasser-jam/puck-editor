import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, PanelTop, PanelBottom } from "lucide-react";
import { useAppStore } from "@/core/store";
import { getClassNameFactory } from "@/core/lib";
import { rootDroppableId } from "@/core/lib/root-droppable-id";
import { AddSectionModal } from "../AddSectionModal";
import { TemplateSectionList } from "./TemplateSectionList";
import { sectionCatalog } from "../section-catalog";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("ShopifyOutlinePanel", styles);

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tagName = target.tagName;
  return tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";
};

/**
 * Shopify-style left sidebar: Header (fixed) → Template (editable) → Footer
 * (fixed) → "Add section" button.
 *
 * Only the Template group persists to `store_config.json` via `content[]`.
 * Header/Footer rows here are informational indicators that the rendered
 * page includes a fixed Header and Footer configured elsewhere (root props +
 * Settings → Theme). Nothing the user does in this component introduces
 * non-JSON-persisted state.
 */
export function ShopifyOutlinePanel() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | undefined>(undefined);
  const dispatch = useAppStore((s) => s.dispatch);

  // Read content length for empty-state detection (avoid subscribing to the
  // entire content array — just its length changes are enough to flip the
  // empty-state render).
  const contentCount = useAppStore((s) => s.state.data.content?.length ?? 0);

  const quickStartPresets = useMemo(
    () =>
      ["hero-band", "two-column", "faq-accordion"]
        .map((id) => sectionCatalog.find((preset) => preset.id === id))
        .filter((preset) => !!preset),
    []
  );

  const openModal = useCallback((index?: number) => {
    setInsertIndex(index);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const insertPresetNow = useCallback(
    (presetId: string) => {
      const preset = sectionCatalog.find((item) => item.id === presetId);
      if (!preset) return;

      const payload = preset.build();

      dispatch({
        type: "insert",
        componentType: payload.type,
        destinationZone: rootDroppableId,
        destinationIndex: contentCount,
        props: payload.props,
        recordHistory: true,
      });

      dispatch({
        type: "setUi",
        ui: { itemSelector: { index: contentCount, zone: rootDroppableId } },
      });
    },
    [dispatch, contentCount]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.key.toLowerCase() !== "a") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      e.preventDefault();

      if (e.shiftKey && contentCount === 0) {
        insertPresetNow("hero-band");
        return;
      }

      openModal();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openModal, insertPresetNow, contentCount]);

  return (
    <div className={getClassName()}>
      <div className={getClassName("scroll")}>
        {/* Header group (fixed) */}
        <div className={getClassName("group")}>
          <div className={getClassName("groupHeader")}>Header</div>
          <div className={getClassName("groupBody")}>
            <div
              className={`${getClassName("row")} ${getClassName("row--fixed")}`}
            >
              <PanelTop size={14} className={getClassName("fixedIcon")} />
              <div className={getClassName("fixedMeta")}>
                <span className={getClassName("fixedLabel")}>Site header</span>
                <span className={getClassName("fixedHint")}>
                  Edit in Settings → Theme
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Template group (editable — this is what persists to content[]) */}
        <div className={getClassName("group")}>
          <div className={getClassName("groupHeader")}>Template</div>
          <div className={getClassName("groupBody")}>
            {contentCount === 0 ? (
              <div className={getClassName("emptyTemplate")}>
                <p className={getClassName("emptyTemplateTitle")}>
                  No sections yet.
                </p>
                <p className={getClassName("emptyTemplateHint")}>
                  Start with a preset to build your page faster, or press A to
                  open the section library.
                </p>
                <div className={getClassName("quickStart")}>
                  {quickStartPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      className={getClassName("quickStartBtn")}
                      onClick={() => insertPresetNow(preset.id)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <p className={getClassName("shortcutHint")}>
                  Tip: press Shift+A to insert Hero instantly.
                </p>
              </div>
            ) : (
              <TemplateSectionList onAddSection={openModal} />
            )}

            <button
              type="button"
              className={`${getClassName("addSection")} ${
                contentCount === 0 ? getClassName("addSection--primary") : ""
              }`.trim()}
              onClick={() => openModal()}
              title="Add section (A)"
              aria-keyshortcuts="A"
            >
              <Plus size={14} />
              Add section
            </button>
          </div>
        </div>

        {/* Footer group (fixed) */}
        <div className={getClassName("group")}>
          <div className={getClassName("groupHeader")}>Footer</div>
          <div className={getClassName("groupBody")}>
            <div
              className={`${getClassName("row")} ${getClassName("row--fixed")}`}
            >
              <PanelBottom size={14} className={getClassName("fixedIcon")} />
              <div className={getClassName("fixedMeta")}>
                <span className={getClassName("fixedLabel")}>Site footer</span>
                <span className={getClassName("fixedHint")}>
                  Edit in Settings → Theme
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddSectionModal
        open={isModalOpen}
        onClose={closeModal}
        insertIndex={insertIndex}
      />
    </div>
  );
}
