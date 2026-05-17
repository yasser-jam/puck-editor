import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FileText,
  Home,
  Package,
  Palette,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { getClassNameFactory } from "@/core/lib";
import {
  PageDefinition,
  PAGES_UPDATED_EVENT,
  getAllPages,
  getEditPath,
  matchCurrentPage,
  normalizePagePath,
  readCustomPages,
  writeCustomPages,
} from "../../../pages";
import { componentKey } from "../../../index";
import { normalizeEditorData } from "../../../../lib/normalize-editor-data";
import type { UserData } from "../../../types";
import {
  DEFAULT_SECTION_NAME,
  createSectionStarterContent,
} from "../../../blocks/Section/starter-data";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("PagesPanel", styles);

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP = {
  Home: Home,
  ShoppingCart: ShoppingCart,
  Package: Package,
  Palette: Palette,
  FileText: FileText,
};

const toPathLabel = (path: string) => {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.replace(/[-_]+/g, " "))
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")
    .trim();
};

const createStorageKey = (path: string) => `puck-demo:${componentKey}:${path}`;

const createStarterPageData = (title: string): UserData => {
  const nonce = Date.now().toString(36);
  const starterContent = createSectionStarterContent().map((item, index) => ({
    ...item,
    props: {
      ...(item.props ?? {}),
      id: `${item.type}-${nonce}-${index}`,
    },
  }));

  return {
    root: {
      props: {
        title,
      },
    },
    zones: {},
    content: [
      {
        type: "Section",
        props: {
          id: `Section-${nonce}`,
          name: DEFAULT_SECTION_NAME,
          anchorId: "",
          visible: true,
          paddingTop: "80px",
          paddingBottom: "80px",
          paddingHorizontal: "24px",
          backgroundColor: "#ffffff",
          theme: "dark",
          maxWidth: "1280px",
          columns: 1,
          gridGap: "24px",
          content: starterContent as any,
        },
      },
    ],
  };
};

// ─── Page item ────────────────────────────────────────────────────────────────

function PageItem({
  page,
  isActive,
}: {
  page: PageDefinition;
  isActive: boolean;
}) {
  const IconComponent = ICON_MAP[page.iconName];
  const editPath = getEditPath(page) + "/edit";

  return (
    <a
      href={editPath}
      className={`${getClassName("item")} ${isActive ? getClassName("item--active") : ""}`}
    >
      <div className={getClassName("iconWrap")}>
        <IconComponent size={16} />
      </div>

      <div className={getClassName("text")}>
        <div className={getClassName("label")}>{page.label}</div>
        <div className={getClassName("path")}>
          {page.dynamic ? page.path : page.path}
        </div>
      </div>

      {page.dynamic && (
        <span className={getClassName("dynamicBadge")}>dynamic</span>
      )}

      {page.isCustom && !page.dynamic && (
        <span className={getClassName("customBadge")}>custom</span>
      )}

      {isActive && <div className={getClassName("activeDot")} />}
    </a>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export function PagesPanel() {
  const [pages, setPages] = useState<PageDefinition[]>(() => getAllPages());
  const [labelDraft, setLabelDraft] = useState("");
  const [pathDraft, setPathDraft] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const refreshPages = useCallback(() => {
    setPages(getAllPages());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    refreshPages();

    window.addEventListener(PAGES_UPDATED_EVENT, refreshPages);
    window.addEventListener("storage", refreshPages);

    return () => {
      window.removeEventListener(PAGES_UPDATED_EVENT, refreshPages);
      window.removeEventListener("storage", refreshPages);
    };
  }, [refreshPages]);

  const currentPage = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return matchCurrentPage(window.location.pathname, pages);
  }, [pages]);

  const handleCreatePage: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (typeof window === "undefined") return;

    const normalizedPath = normalizePagePath(pathDraft);

    if (!normalizedPath) {
      setFormError(
        "Use a valid path like /about-us. Dynamic paths and /edit are not allowed."
      );
      return;
    }

    const existingEditPaths = new Set(pages.map((page) => getEditPath(page)));
    if (existingEditPaths.has(normalizedPath)) {
      setFormError("A page with that path already exists.");
      return;
    }

    const normalizedLabel =
      labelDraft.trim() || toPathLabel(normalizedPath) || "New Page";

    const nextPage: PageDefinition = {
      path: normalizedPath,
      label: normalizedLabel,
      description: "Custom page",
      iconName: "FileText",
      dynamic: false,
      isCustom: true,
    };

    const nextCustomPages = [...readCustomPages(), nextPage];
    writeCustomPages(nextCustomPages);

    const storageKey = createStorageKey(normalizedPath);
    if (!window.localStorage.getItem(storageKey)) {
      const starterData = normalizeEditorData(
        createStarterPageData(normalizedLabel)
      );
      window.localStorage.setItem(storageKey, JSON.stringify(starterData));
    }

    setFormError(null);
    setLabelDraft("");
    setPathDraft("");

    window.location.assign(`${normalizedPath}/edit`);
  };

  return (
    <div className={getClassName()}>
      <div className={getClassName("header")}>Pages</div>
      <p className={getClassName("intro")}>
        Manage the pages shoppers can visit. New pages start with a ready-made
        section so you never land on a blank canvas.
      </p>

      <form className={getClassName("create")} onSubmit={handleCreatePage}>
        <div className={getClassName("createHeader")}>Add a page</div>

        <label className={getClassName("fieldLabel")}>
          <span>Label</span>
          <input
            type="text"
            value={labelDraft}
            onChange={(event) => setLabelDraft(event.target.value)}
            placeholder="About us"
          />
        </label>

        <label className={getClassName("fieldLabel")}>
          <span>Path</span>
          <input
            type="text"
            value={pathDraft}
            onChange={(event) => setPathDraft(event.target.value)}
            placeholder="/about-us"
            required
          />
        </label>

        {formError ? <p className={getClassName("error")}>{formError}</p> : null}

        <button type="submit" className={getClassName("createButton")}>
          <Plus size={14} />
          Add and open page
        </button>
      </form>

      <div className={getClassName("list")}>
        {pages.map((page) => (
          <PageItem
            key={`${page.path}-${page.isCustom ? "custom" : "core"}`}
            page={page}
            isActive={currentPage?.path === page.path}
          />
        ))}
      </div>

      <p className={getClassName("hint")}>
        Click a page to switch the editor to that page. Each page has its own
        independent content.
      </p>
    </div>
  );
}
