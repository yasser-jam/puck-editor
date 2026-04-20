import { Slot } from "@/core/types";

export const DEFAULT_SECTION_NAME = "New Section";

export const createSectionStarterContent = (): Slot => [
  {
    type: "ContentHeading",
    props: {
      text: "New section heading",
      level: "2",
      textAlign: "left",
    },
  },
  {
    type: "ContentParagraph",
    props: {
      text: "Add supporting text here to describe this section and guide visitors toward the next action.",
      textAlign: "left",
    },
  },
  {
    type: "ContentButton",
    props: {
      label: "Call to action",
      align: "center",
    },
  },
];
