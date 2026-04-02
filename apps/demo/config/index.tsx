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

import Root from "./root";
import { UserConfig } from "./types";
import { initialData } from "./initial-data";

// We avoid the name config as next gets confused
export const conf: UserConfig = {
  root: Root,
  categories: {
    presets: {
      title: "Presets",
      defaultExpanded: true,
      components: ["ProductCard", "ProductsGrid"],
    },
    sections: {
      title: "Sections",
      components: ["Section"],
    },
    content: {
      title: "Content",
      defaultExpanded: true,
      components: [
        "ContentHeading",
        "ContentParagraph",
        "ContentImage",
        "ContentButton",
        "ContentDivider",
        "Space",
        "ImageGallery",
        "VideoEmbed",
        "ContentIcon",
        "Group",
      ],
    },
    products: {
      title: "Product Blocks",
      components: ["ProductImage", "ProductInfo"],
    },
    legacy: {
      title: "Legacy",
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
    Section,
    Group,
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
    Space,
    RichText,
    ProductCard,
    ProductsGrid,
    ProductImage,
    ProductInfo,
    ContentHeading,
    ContentParagraph,
    ContentImage,
    ContentButton,
    ContentDivider,
    ImageGallery,
    VideoEmbed,
    ContentIcon,
  },
};

export const componentKey = Buffer.from(
  `${Object.keys(conf.components).join("-")}-${JSON.stringify(initialData)}`
).toString("base64");

export default conf;
