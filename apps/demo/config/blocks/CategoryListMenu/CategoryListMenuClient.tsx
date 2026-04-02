/* eslint-disable @next/next/no-img-element */
"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { getClassNameFactory } from "@/core/lib";
import {
  products,
  formatPrice,
  discountedPrice,
  type Product,
} from "../../data/products";
import styles from "./styles.module.css";
import type { CategoryListMenuProps } from "./types";

const getClassName = getClassNameFactory("CategoryListMenu", styles);

function displayPrice(p: Product): { current: string; was?: string } {
  const hasDiscount =
    typeof p.discount === "number" && p.discount > 0;
  if (hasDiscount) {
    return {
      current: formatPrice(discountedPrice(p.price, p.discount!)),
      was: formatPrice(p.price),
    };
  }
  return { current: formatPrice(p.price) };
}

function distinctCategories(): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of products) {
    for (const c of p.categories) {
      map.set(c, (map.get(c) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function productsInCategory(
  category: string,
  maxProducts: number
): Product[] {
  const list = products.filter((p) => p.categories.includes(category));
  if (maxProducts > 0 && list.length > maxProducts) {
    return list.slice(0, maxProducts);
  }
  return list;
}

export function CategoryListMenuClient({
  buttonLabel,
  categoriesMenuTitle,
  backLabel,
  maxProducts,
}: CategoryListMenuProps) {
  const headingId = useId();
  const cap =
    typeof maxProducts === "number" && !Number.isNaN(maxProducts)
      ? maxProducts
      : 0;

  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ top: 0, left: 0, width: 420 });

  const categoryRows = useMemo(() => distinctCategories(), []);

  const productRows = useMemo(() => {
    if (!selectedCategory) return [];
    return productsInCategory(selectedCategory, cap);
  }, [selectedCategory, cap]);

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const w = Math.min(420, window.innerWidth - 16);
    let left = r.left;
    if (left + w > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - w - 8);
    }
    setBox({
      top: r.bottom + 8,
      left,
      width: w,
    });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setSelectedCategory(null);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => updatePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent | PointerEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      close();
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open, close]);

  const portal =
    open &&
    typeof document !== "undefined" &&
    createPortal(
      <>
        <button
          type="button"
          className={getClassName("backdrop")}
          aria-hidden
          tabIndex={-1}
          onClick={close}
        />
        <div
          ref={panelRef}
          className={getClassName("popover")}
          style={{
            position: "fixed",
            top: box.top,
            left: box.left,
            width: box.width,
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
        >
          <div className={getClassName("header")}>
            <div className={getClassName("headerRow")}>
              {selectedCategory ? (
                <button
                  type="button"
                  className={getClassName("backBtn")}
                  aria-label={backLabel}
                  onClick={() => setSelectedCategory(null)}
                >
                  <ArrowLeft size={18} strokeWidth={2.25} aria-hidden />
                </button>
              ) : null}
              <h2 id={headingId} className={getClassName("heading")}>
                {selectedCategory ?? categoriesMenuTitle}
              </h2>
            </div>
          </div>

          <div className={getClassName("list")}>
            {!selectedCategory ? (
              categoryRows.length === 0 ? (
                <div className={getClassName("empty")}>
                  No categories in the demo catalog.
                </div>
              ) : (
                categoryRows.map(({ name, count }) => (
                  <button
                    key={name}
                    type="button"
                    className={getClassName("catRow")}
                    onClick={() => setSelectedCategory(name)}
                  >
                    <span className={getClassName("catName")}>{name}</span>
                    <span className={getClassName("count")}>{count}</span>
                    <span className={getClassName("catChevron")} aria-hidden>
                      <ChevronRight size={18} strokeWidth={2} />
                    </span>
                  </button>
                ))
              )
            ) : productRows.length === 0 ? (
              <div className={getClassName("empty")}>
                No products in this category.
              </div>
            ) : (
              productRows.map((p) => {
                const { current, was } = displayPrice(p);
                return (
                  <a
                    key={p.id}
                    href={`#product-${p.id}`}
                    className={getClassName("card")}
                    onClick={(e) => {
                      e.preventDefault();
                      close();
                    }}
                  >
                    <img
                      className={getClassName("thumb")}
                      src={p.image}
                      alt=""
                      width={64}
                      height={64}
                    />
                    <div className={getClassName("cardBody")}>
                      <div className={getClassName("cardTitle")}>{p.title}</div>
                      <div className={getClassName("cardMeta")}>
                        {was && (
                          <span className={getClassName("price--strike")}>
                            {was}
                          </span>
                        )}
                        <span className={getClassName("price")}>{current}</span>
                        {typeof p.discount === "number" && p.discount > 0 && (
                          <span className={getClassName("badge")}>
                            −{p.discount}%
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })
            )}
          </div>

          <div className={getClassName("footer")}>
            Categories from <code>config/data/products.ts</code>
          </div>
        </div>
      </>,
      document.body
    );

  return (
    <div className={getClassName()}>
      <button
        ref={triggerRef}
        type="button"
        className={getClassName("trigger")}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => {
          setOpen((v) => {
            const next = !v;
            if (next) {
              setSelectedCategory(null);
              updatePosition();
            }
            return next;
          });
        }}
      >
        <span className={getClassName("triggerIcon")} aria-hidden>
          <LayoutGrid size={18} strokeWidth={2.25} />
        </span>
        {buttonLabel}
      </button>
      {portal}
    </div>
  );
}
