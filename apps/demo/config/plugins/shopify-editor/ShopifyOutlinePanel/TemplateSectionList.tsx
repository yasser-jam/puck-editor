import React, { startTransition, useMemo } from "react";
import {
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Plus,
  GripVertical,
  LayoutTemplate,
} from "lucide-react";
import type { ComponentData } from "@/core/types";
import { useAppStore, useAppStoreApi } from "@/core/store";
import { rootDroppableId } from "@/core/lib/root-droppable-id";
import { getClassNameFactory } from "@/core/lib";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("ShopifyOutlinePanel", styles);

// ─── Row ────────────────────────────────────────────────────────────────────

type SectionRowProps = {
  index: number;
  id: string;
  label: string;
  hidden: boolean;
  selected: boolean;
  onRequestInsertAfter: (index: number) => void;
};

const SectionRow = React.memo(function SectionRow({
  index,
  id,
  label,
  hidden,
  selected,
  onRequestInsertAfter,
}: SectionRowProps) {
  const dispatch = useAppStore((s) => s.dispatch);
  const storeApi = useAppStoreApi();

  const select = () => {
    dispatch({
      type: "setUi",
      ui: { itemSelector: { index, zone: rootDroppableId } },
    });
  };

  const toggleHidden = (e: React.MouseEvent) => {
    e.stopPropagation();
    const snapshot = storeApi.getState().state.data.content?.[index];
    if (!snapshot) return;
    startTransition(() => {
      dispatch({
        type: "replace",
        destinationZone: rootDroppableId,
        destinationIndex: index,
        data: {
          ...snapshot,
          props: {
            ...snapshot.props,
            visible: !hidden ? false : true,
          },
        },
        recordHistory: true,
      });
    });
  };

  const duplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(() => {
      dispatch({
        type: "duplicate",
        sourceIndex: index,
        sourceZone: rootDroppableId,
        recordHistory: true,
      });
    });
  };

  const remove = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Skip a confirm() dialog — the action records history, so Cmd/Ctrl+Z
    // undoes it instantly. Shopify mirrors this pattern for section rows.
    startTransition(() => {
      dispatch({
        type: "remove",
        index,
        zone: rootDroppableId,
        recordHistory: true,
      });
    });
  };

  const rowClass = [
    getClassName("sectionRow"),
    selected ? getClassName("sectionRow--selected") : "",
    hidden ? getClassName("sectionRow--hidden") : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={rowClass}
      onClick={select}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select();
        }
      }}
      data-section-id={id}
    >
      <span className={getClassName("sectionHandle")} aria-hidden>
        <GripVertical size={12} />
      </span>
      <span className={getClassName("sectionIndex")}>{index + 1}</span>
      <span className={getClassName("sectionIcon")} aria-hidden>
        <LayoutTemplate size={13} />
      </span>
      <span className={getClassName("sectionLabel")} title={label}>
        {label}
      </span>
      <div className={getClassName("sectionActions")} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={getClassName("actionBtn")}
          onClick={toggleHidden}
          title={hidden ? "Show section" : "Hide section"}
          aria-label={hidden ? "Show section" : "Hide section"}
        >
          {hidden ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
        <button
          type="button"
          className={getClassName("actionBtn")}
          onClick={duplicate}
          title="Duplicate section"
          aria-label="Duplicate section"
        >
          <Copy size={13} />
        </button>
        <button
          type="button"
          className={`${getClassName("actionBtn")} ${getClassName(
            "actionBtn--danger"
          )}`}
          onClick={remove}
          title="Delete section"
          aria-label="Delete section"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
});

// ─── List ───────────────────────────────────────────────────────────────────

type Props = {
  onAddSection: (insertAfterIndex?: number) => void;
};

/**
 * Top-level sections list for the Template group.
 *
 * Subscribes ONLY to what it renders: the slim `{id, type, label, visible}`
 * tuple for each top-level section, plus the current selection. Any edit that
 * doesn't change these fields (typing in a field, dragging a nested block,
 * switching pages in another tab) will not re-render this list.
 */
export function TemplateSectionList({ onAddSection }: Props) {
  const selectedIndex = useAppStore((s) => {
    const sel = s.state.ui.itemSelector;
    if (!sel) return -1;
    if (sel.zone && sel.zone !== rootDroppableId) return -1;
    return sel.index ?? -1;
  });

  type Row = { id: string; label: string; visible: boolean };

  // Subscribe to the raw content array by reference — Puck's reducer keeps the
  // same array reference when nothing changes, so this produces zero extra
  // renders when the user is editing deep inside a section.
  const content = useAppStore(
    (s) => s.state.data.content as ComponentData[] | undefined
  );
  // Config is stable — read once.
  const components = useAppStore((s) => s.config.components);

  // Derive the rows *after* subscription, so each re-render creates a fresh
  // mapped array but we don't trigger Zustand's subscription loop (which would
  // happen if we returned a new array object from the selector itself).
  const rows: Row[] = useMemo(() => {
    return (content ?? []).map((item) => {
      const def = components?.[item.type];
      const idFromProps =
        (item.props as { id?: string } | undefined)?.id ?? item.type;
      const visible =
        (item.props as { visible?: boolean } | undefined)?.visible !== false;
      const label =
        (def as { label?: string } | undefined)?.label ?? item.type;
      return { id: idFromProps, label, visible };
    });
  }, [content, components]);

  const list = useMemo(
    () =>
      rows.map((row, index) => (
        <React.Fragment key={row.id}>
          <SectionRow
            index={index}
            id={row.id}
            label={row.label}
            hidden={!row.visible}
            selected={index === selectedIndex}
            onRequestInsertAfter={onAddSection}
          />
          {/* Inline "add section" gap between rows. Visible on list hover. */}
          {index < rows.length - 1 && (
            <button
              type="button"
              className={getClassName("inlineAdd")}
              onClick={() => onAddSection(index + 1)}
              title="Add section here"
              aria-label={`Add section after position ${index + 1}`}
            >
              <Plus size={10} />
              Add here
            </button>
          )}
        </React.Fragment>
      )),
    [rows, selectedIndex, onAddSection]
  );

  return <div className={getClassName("sectionsList")}>{list}</div>;
}
