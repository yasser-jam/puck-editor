import React, { useMemo, useState } from "react";
import { Plus, PanelTop, PanelBottom } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { LayerTree } from "@/core/components/LayerTree";
import { useAppStore } from "@/core/store";
import { findZonesForArea } from "@/core/lib/data/find-zones-for-area";
import { getClassNameFactory } from "@/core/lib";
import { AddSectionModal } from "../AddSectionModal";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("ShopifyOutlinePanel", styles);

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

  const rootZones = useAppStore(
    useShallow((s) => findZonesForArea(s.state, "root"))
  );

  // Read content length for empty-state detection (avoid subscribing to the
  // entire content array — just its length changes are enough to flip the
  // empty-state render).
  const contentCount = useAppStore(
    (s) => s.state.data.content?.length ?? 0
  );

  const openModal = (index?: number) => {
    setInsertIndex(index);
    setModalOpen(true);
  };

  const Zones = useMemo(
    () =>
      rootZones.map((zoneCompound) => (
        <LayerTree
          key={zoneCompound}
          label={rootZones.length === 1 ? "" : zoneCompound.split(":")[1]}
          zoneCompound={zoneCompound}
        />
      )),
    [rootZones]
  );

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
              <PanelTop
                size={14}
                className={getClassName("fixedIcon")}
              />
              <div className={getClassName("fixedMeta")}>
                <span className={getClassName("fixedLabel")}>
                  Site header
                </span>
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
                No sections yet.
                <br />
                Add your first section below.
              </div>
            ) : (
              <div className={getClassName("layerTreeWrap")}>{Zones}</div>
            )}

            <button
              type="button"
              className={`${getClassName("addSection")} ${
                contentCount === 0
                  ? getClassName("addSection--primary")
                  : ""
              }`.trim()}
              onClick={() => openModal()}
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
              <PanelBottom
                size={14}
                className={getClassName("fixedIcon")}
              />
              <div className={getClassName("fixedMeta")}>
                <span className={getClassName("fixedLabel")}>
                  Site footer
                </span>
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
        onClose={() => setModalOpen(false)}
        insertIndex={insertIndex}
      />
    </div>
  );
}
