import { Button } from "./blocks/Button";
import { Card } from "./blocks/Card";
import { Grid } from "./blocks/Grid";
import { Hero } from "./blocks/Hero";
import { Heading } from "./blocks/Heading";
import { Flex } from "./blocks/Flex";
import { Logos } from "./blocks/Logos";
import { Stats } from "./blocks/Stats";
import { Template } from "./blocks/Template";
import { Text } from "./blocks/Text";
import { Space } from "./blocks/Space";
import { RichText } from "./blocks/RichText";
import { ProductCard } from "./blocks/ProductCard";
import { ProductsGrid } from "./blocks/ProductsGrid";
import { CartSection } from "./blocks/CartSection";
import { CheckoutForm } from "./blocks/CheckoutForm";
import { ProductSearchMenu } from "./blocks/ProductSearchMenu";
import { CategoryListMenu } from "./blocks/CategoryListMenu";
import { ProductImage } from "./blocks/ProductImage";
import { ProductInfo } from "./blocks/ProductInfo";
import { Section } from "./blocks/Section";
import { Group } from "./blocks/Group";
import { ContentHeading } from "./blocks/ContentHeading";
import { ContentParagraph } from "./blocks/ContentParagraph";
import { ContentImage } from "./blocks/ContentImage";
import { ContentButton } from "./blocks/ContentButton";
import { ContentDivider } from "./blocks/ContentDivider";
import { ImageGallery } from "./blocks/ImageGallery";
import { VideoEmbed } from "./blocks/VideoEmbed";
import { ContentIcon } from "./blocks/ContentIcon";
import { ContentHtml } from "./blocks/ContentHtml";
import { OrderHistory } from "./blocks/OrderHistory";
import { Wishlist } from "./blocks/Wishlist";
import { Testimonials } from "./blocks/Testimonials";
import { ContactForm } from "./blocks/ContactForm";

import Root from "./root";
import { UserConfig } from "./types";
import { initialData } from "./initial-data";

// Categories follow SRS § 4.2 taxonomy:
//   - Sections   → DSN-003 page-level bands
//   - Bound      → DSN-005 a–j data-bound blocks (commerce, customer)
//   - Content    → DSN-004 a–j Generic blocks (data-agnostic)
//   - Group      → DSN-006 / DSN-004k layout containers
//   - Legacy     → kept hidden; preserved so old store_config.json still loads
//
// Block IDs in order roughly mirror the SRS sub-spec ordering so an AI agent
// scanning the config can map to requirement IDs predictably.
export const conf: UserConfig = {
  root: Root,
  categories: {
    sections: {
      title: "Sections",
      defaultExpanded: true,
      components: ["Section"],
    },
    bound: {
      title: "Store Blocks",
      defaultExpanded: true,
      components: [
        // Commerce (DSN-005 a–f)
        "ProductsGrid",
        "ProductCard",
        "CategoryListMenu",
        "CartSection",
        "CheckoutForm",
        "ProductSearchMenu",
        // Customer (DSN-005 g–j)
        "OrderHistory",
        "Wishlist",
        "Testimonials",
        "ContactForm",
        // Product detail page primitives
        "ProductImage",
        "ProductInfo",
      ],
    },
    content: {
      title: "Content",
      defaultExpanded: true,
      components: [
        // DSN-004 a–j ordering
        "ContentHeading",     // DSN-004a
        "ContentParagraph",   // DSN-004b
        "ContentImage",       // DSN-004c
        "ContentButton",      // DSN-004d
        "ContentDivider",     // DSN-004e
        "Space",              // DSN-004f
        "ImageGallery",       // DSN-004g
        "VideoEmbed",         // DSN-004h
        "ContentIcon",        // DSN-004i
        "ContentHtml",        // DSN-004j
      ],
    },
    group: {
      title: "Layout",
      components: ["Group"], // DSN-004k / DSN-006
    },
    legacy: {
      title: "Legacy (hidden)",
      visible: false,
      components: [
        "Heading",
        "Text",
        "RichText",
        "Button",
        "Card",
        "Grid",
        "Flex",
        "Hero",
        "Logos",
        "Stats",
        "Template",
      ],
    },
  },
  components: {
    // Sections
    Section,
    // Group / Layout
    Group,
    // Bound — commerce
    ProductsGrid,
    ProductCard,
    CategoryListMenu,
    CartSection,
    CheckoutForm,
    ProductSearchMenu,
    ProductImage,
    ProductInfo,
    // Bound — customer (newly added: DSN-005 g/h/i/j)
    OrderHistory,
    Wishlist,
    Testimonials,
    ContactForm,
    // Content (DSN-004 a–j)
    ContentHeading,
    ContentParagraph,
    ContentImage,
    ContentButton,
    ContentDivider,
    Space,
    ImageGallery,
    VideoEmbed,
    ContentIcon,
    ContentHtml,
    // Legacy — kept registered so existing store_config.json can still render,
    // but hidden from the picker (see categories.legacy.visible = false).
    Button,
    Card,
    Grid,
    Hero,
    Heading,
    Flex,
    Logos,
    Stats,
    Template,
    Text,
    RichText,
  },
};

export const componentKey = Buffer.from(
  `${Object.keys(conf.components).join("-")}-${JSON.stringify(initialData)}`
).toString("base64");

export default conf;
