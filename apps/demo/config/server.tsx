import { Grid } from "./blocks/Grid";
import { Hero } from "./blocks/Hero/server";
import { Heading } from "./blocks/Heading";
import { Text } from "./blocks/Text";
import { Space } from "./blocks/Space";
import { ProductCard } from "./blocks/ProductCard";
import { ProductImage } from "./blocks/ProductImage";
import { Section } from "./blocks/Section";
import { Group } from "./blocks/Group";
import Root from "./root.server";
import { UserConfig } from "./types";

const conf = {
  root: Root,
  categories: {
    sections: {
      title: "Sections",
      defaultExpanded: true,
      components: ["Section"],
    },
    content: {
      title: "Content",
      defaultExpanded: true,
      components: [
        "Hero",
        "Heading",
        "Text",
        "Space",
        "Grid",
        "Group",
        "ProductCard",
        "ProductImage",
      ],
    },
  },
  components: {
    Section,
    Group,
    Grid,
    Hero,
    Heading,
    Text,
    Space,
    ProductCard,
    ProductImage,
  },
} as unknown as UserConfig;

export default conf;
