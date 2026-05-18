import { UserData } from "./types";
import { products } from "./data/products";
import {
  buildThemesGalleryData,
  buildAllThemeDemoInitialEntries,
} from "./theme-presets";

const DEFAULT_APP = {
  name: "SOOQ Merchant Mobile",
  bundleId: "com.sooq.merchant.mobile",
  apiBaseUrl: "https://sooq.up.railway.app",
  tenantId: "3fc183e8-ac80-4b2a-8bf1-4cd6ac6ffcb1",
  tenantSlug: "anasgoldenmer",
};

const createRootProps = (title: string) => ({
  title,
  bodyFont: "system",
  fontOption1: "system",
  fontOption2: "system",
  app: DEFAULT_APP,
});

/** Shared ProductCard advanced styling defaults (empty = use theme / scheme) */
const PC_ADV = {
  backgroundColor: "",
  textColor: "",
  accentColor: "",
  priceColor: "",
  borderColor: "",
  titleFontSize: "",
  titleFontWeight: "",
  descriptionFontSize: "",
  descriptionLineClamp: 3,
  priceFontSize: "",
  borderRadius: "",
  cardPadding: "",
  contentGap: "",
  imageWidth: "",
  borderWidth: "",
  boxShadow: "",
};

export const initialData: Record<string, UserData> = {
  "/": {
    root: {
      props: createRootProps("SOOQ Merchant Store"),
    },
    zones: {},
    content: [
      {
        type: "Section",
        props: {
          id: "Section-hero",
          name: "Hero",
          anchorId: "hero",
          visible: true,
          paddingTop: "88px",
          paddingBottom: "88px",
          paddingHorizontal: "24px",
          backgroundColor: "#ffffff",
          theme: "light",
          maxWidth: "100%",
          content: [
            {
              type: "ContentHeading",
              props: {
                id: "ContentHeading-home-hero",
                text: "Build your storefront with a real commerce starter",
                level: "1",
                textAlign: "left",
                fontFamily: "body",
                fontSizeMode: "theme",
                fontSizeTheme: "lg",
                fontSizeFixed: "1.5rem",
                fontWeightMode: "theme",
                fontWeightTheme: "semibold",
                fontWeightFixed: "600",
                lineHeightMode: "theme",
                lineHeightTheme: "normal",
                lineHeightFixed: "1.4",
                fontStyle: "normal",
                textTransform: "none",
                colorTheme: "text",
                colorMode: "theme",
                colorFixed: "#0f172a",
                layout: { padding: "0px" },
              },
            },
            {
              type: "Space",
              props: { id: "Space-home-hero-1", size: "16px", direction: "vertical" },
            },
            {
              type: "ContentParagraph",
              props: {
                id: "ContentParagraph-home-hero",
                text: "Arabic-first layout, SYP defaults, customer pages, and the core commerce blocks merchants expect on day one.",
                textAlign: "left",
                fontFamily: "body",
                fontSizeMode: "theme",
                fontSizeTheme: "md",
                fontSizeFixed: "1rem",
                fontWeightMode: "theme",
                fontWeightTheme: "normal",
                fontWeightFixed: "400",
                lineHeightMode: "theme",
                lineHeightTheme: "normal",
                lineHeightFixed: "1.6",
                fontStyle: "normal",
                textTransform: "none",
                maxWidth: "720px",
                layout: { padding: "0px" },
              },
            },
            {
              type: "Space",
              props: { id: "Space-home-hero-2", size: "24px", direction: "vertical" },
            },
            {
              type: "ContentButton",
              props: {
                id: "ContentButton-home-hero",
                label: "Shop featured products",
                align: "left",
                buttonAction: "link",
                link: { kind: "page", pageId: "/products/example-product" },
                radiusMode: "theme",
                radiusTheme: "md",
                radiusFixed: "8px",
                bgMode: "theme",
                bgTheme: "primary",
                bgFixed: "#2563eb",
                fgMode: "theme",
                fgTheme: "surface",
                fgFixed: "#ffffff",
                sizeMode: "theme",
                sizeTheme: "md",
                fixedHeight: "40px",
                fixedPadX: "16px",
                fixedPadY: "8px",
                fixedFontSize: "1rem",
                layout: { padding: "0px" },
              },
            },
          ],
        },
      },
      {
        type: "Section",
        props: {
          id: "Section-products",
          name: "Featured products",
          anchorId: "featured-products",
          visible: true,
          paddingTop: "80px",
          paddingBottom: "80px",
          paddingHorizontal: "24px",
          backgroundColor: "#f8f9fa",
          theme: "light",
          maxWidth: "1280px",
          content: [
            {
              type: "ContentHeading",
              props: {
                id: "Heading-featured",
                level: "2",
                text: "Featured products",
                fontFamily: "option1",
                textAlign: "center",
                fontSizeMode: "theme",
                fontSizeTheme: "lg",
                fontSizeFixed: "1.5rem",
                fontWeightMode: "theme",
                fontWeightTheme: "semibold",
                fontWeightFixed: "600",
                lineHeightMode: "theme",
                lineHeightTheme: "normal",
                lineHeightFixed: "1.4",
                fontStyle: "normal",
                textTransform: "none",
                layout: { padding: "0px" },
                colorTheme: "text",
                colorMode: "theme",
                colorFixed: "#0f172a",
              },
            },
            {
              type: "Space",
              props: { id: "Space-products-sub", size: "12px", direction: "vertical" },
            },
            {
              type: "ContentParagraph",
              props: {
                id: "Text-products-sub",
                text: "Hand-picked bestsellers from this week.",
                textAlign: "center",
                fontFamily: "body",
                fontSizeMode: "theme",
                fontSizeTheme: "md",
                fontSizeFixed: "1rem",
                fontWeightMode: "theme",
                fontWeightTheme: "normal",
                fontWeightFixed: "400",
                lineHeightMode: "theme",
                lineHeightTheme: "normal",
                lineHeightFixed: "1.6",
                fontStyle: "normal",
                textTransform: "none",
                maxWidth: "720px",
                layout: { padding: "0px" },
              },
            },
            {
              type: "Space",
              props: { id: "Space-products-grid", size: "40px", direction: "vertical" },
            },
            {
              type: "ProductsGrid",
              props: {
                id: "ProductsGrid-home",
                collection: products[0]?.collections?.[0] ?? "Summer 2025",
                columns: "3",
                maxRows: "1",
                gap: "lg",
                cardVariant: "vertical",
              },
            },
          ],
        },
      },
      {
        type: "Section",
        props: {
          id: "Section-about",
          name: "Collections",
          anchorId: "collections",
          visible: true,
          paddingTop: "80px",
          paddingBottom: "80px",
          paddingHorizontal: "24px",
          backgroundColor: "#ffffff",
          theme: "light",
          maxWidth: "1280px",
          content: [
            {
              type: "CategoryListMenu",
              props: {
                id: "CategoryListMenu-home",
                buttonLabel: "Browse categories",
                categoriesMenuTitle: "Shop by category",
                backLabel: "Back to categories",
                maxProducts: 12,
              },
            },
          ],
        },
      },
      {
        type: "Section",
        props: {
          id: "Section-cta-hero",
          name: "Customer tools",
          anchorId: "customer-tools",
          visible: true,
          paddingTop: "80px",
          paddingBottom: "80px",
          paddingHorizontal: "24px",
          backgroundColor: "#f9fafb",
          theme: "light",
          maxWidth: "1280px",
          content: [
            {
              type: "Testimonials",
              props: {
                id: "Testimonials-home",
                source: "inline",
                layoutVariant: "grid",
                columns: 3,
                language: "ar",
                showRating: true,
                showAvatars: true,
                itemCount: 3,
                inlineItems: [],
              },
            },
            {
              type: "Space",
              props: { id: "Space-home-customer", size: "32px", direction: "vertical" },
            },
            {
              type: "ContactForm",
              props: {
                id: "ContactForm-home",
                title: { ar: "تواصل معنا", en: "Get in touch" },
                subtitle: { ar: "سنرد خلال يوم عمل واحد.", en: "We'll reply within one business day." },
                language: "ar",
                showPhone: true,
                showSubject: true,
                requirePhone: false,
                submitLabel: "إرسال",
                successMessage: "شكراً — تم إرسال رسالتك.",
                enableCaptcha: true,
                submitWidth: "auto",
              },
            },
          ],
        },
      },
      {
        type: "Section",
        props: {
          id: "Section-operations",
          name: "Commerce operations",
          anchorId: "commerce-operations",
          visible: true,
          paddingTop: "80px",
          paddingBottom: "88px",
          paddingHorizontal: "24px",
          backgroundColor: "#ffffff",
          theme: "light",
          maxWidth: "1280px",
          content: [
            {
              type: "CartSection",
              props: {
                id: "CartSection-home",
                layoutStyle: "rows",
                gap: "md",
                showDividerLines: true,
              },
            },
            {
              type: "Space",
              props: { id: "Space-home-operations-1", size: "24px", direction: "vertical" },
            },
            {
              type: "CheckoutForm",
              props: {
                id: "CheckoutForm-home",
                showDataHints: true,
              },
            },
            {
              type: "Space",
              props: { id: "Space-home-operations-2", size: "24px", direction: "vertical" },
            },
            {
              type: "OrderHistory",
              props: {
                id: "OrderHistory-home",
                limit: 3,
                currency: "SYP",
                statusFilter: "all",
                showThumbnails: true,
                emptyStateText: "You have no orders yet.",
              },
            },
            {
              type: "Space",
              props: { id: "Space-home-operations-3", size: "24px", direction: "vertical" },
            },
            {
              type: "Wishlist",
              props: {
                id: "Wishlist-home",
                columns: 3,
                gap: "md",
                currency: "SYP",
                showAddToCart: true,
                ctaLabel: "Add to cart",
                emptyStateText: "Your wishlist is empty.",
              },
            },
          ],
        },
      },
    ],
  },

  ...buildAllThemeDemoInitialEntries(),

  "/themes": buildThemesGalleryData(),

  "/pricing": {
    content: [],
    root: { props: createRootProps("Pricing") },
  },

  "/about": {
    content: [],
    root: { props: createRootProps("About Us") },
  },

  "/checkout": {
    root: { props: createRootProps("Checkout") },
    zones: {},
    content: [
      {
        type: "Section",
        props: {
          id: "Section-checkout",
          name: "Checkout",
          anchorId: "checkout",
          visible: true,
          paddingTop: "72px",
          paddingBottom: "72px",
          paddingHorizontal: "24px",
          backgroundColor: "#ffffff",
          theme: "light",
          maxWidth: "1000px",
          content: [
            {
              type: "CheckoutForm",
              props: {
                id: "CheckoutForm-checkout",
                showDataHints: true,
              },
            },
          ],
        },
      },
    ],
  },

  "/wishlist": {
    root: { props: createRootProps("Wishlist") },
    zones: {},
    content: [
      {
        type: "Section",
        props: {
          id: "Section-wishlist",
          name: "Wishlist",
          anchorId: "wishlist",
          visible: true,
          paddingTop: "72px",
          paddingBottom: "72px",
          paddingHorizontal: "24px",
          backgroundColor: "#ffffff",
          theme: "light",
          maxWidth: "1200px",
          content: [
            {
              type: "Wishlist",
              props: {
                id: "Wishlist-page",
                columns: 3,
                gap: "md",
                currency: "SYP",
                showAddToCart: true,
                ctaLabel: "Add to cart",
                emptyStateText: "Your wishlist is empty.",
              },
            },
          ],
        },
      },
    ],
  },

  "/orders": {
    root: { props: createRootProps("Orders") },
    zones: {},
    content: [
      {
        type: "Section",
        props: {
          id: "Section-orders",
          name: "Orders",
          anchorId: "orders",
          visible: true,
          paddingTop: "72px",
          paddingBottom: "72px",
          paddingHorizontal: "24px",
          backgroundColor: "#ffffff",
          theme: "light",
          maxWidth: "1200px",
          content: [
            {
              type: "OrderHistory",
              props: {
                id: "OrderHistory-page",
                limit: 5,
                currency: "SYP",
                statusFilter: "all",
                showThumbnails: true,
                emptyStateText: "You have no orders yet.",
              },
            },
          ],
        },
      },
    ],
  },

  // ── Cart page ─────────────────────────────────────────────────────────────
  "/cart": {
    root: { props: createRootProps("Cart") },
    zones: {},
    content: [
      {
        type: "Section",
        props: {
          id: "Section-cart-header",
          name: "Cart",
          anchorId: "cart",
          visible: true,
          paddingTop: "72px",
          paddingBottom: "72px",
          paddingHorizontal: "24px",
          backgroundColor: "#ffffff",
          theme: "light",
          maxWidth: "1200px",
          content: [
            {
              type: "CartSection",
              props: {
                id: "CartSection-cart",
                layoutStyle: "rows",
                gap: "md",
                showDividerLines: true,
              },
            },
          ],
        },
      },
    ],
  },

  // ── Product details page (example slug) ───────────────────────────────────
  "/products/example-product": {
    root: { props: createRootProps("Product Details") },
    zones: {},
    content: [
      {
        type: "Section",
        props: {
          id: "Section-product-detail",
          name: "Product details",
          anchorId: "product-details",
          visible: true,
          paddingTop: "72px",
          paddingBottom: "72px",
          paddingHorizontal: "24px",
          backgroundColor: "#ffffff",
          theme: "light",
          maxWidth: "1200px",
          content: [
            {
              type: "Group",
              props: {
                id: "Group-product-detail",
                direction: "row",
                gap: 32,
                alignItems: "flex-start",
                justifyContent: "flex-start",
                wrap: "wrap",
                layout: { padding: "0px" },
                content: [
                  {
                    type: "ProductImage",
                    props: {
                      id: "ProductImage-detail",
                      product: products[3],
                      aspectRatio: "landscape",
                      width: "400px",
                      borderRadius: "lg",
                      showBadges: true,
                    },
                  },
                  {
                    type: "ProductInfo",
                    props: {
                      id: "ProductInfo-detail",
                      product: products[3],
                      showTitle: true,
                      showDescription: true,
                      showCategories: true,
                      showPrice: true,
                      showStockBadge: true,
                      titleSize: "xl",
                      priceSize: "l",
                      align: "left",
                      padding: "lg",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
};
