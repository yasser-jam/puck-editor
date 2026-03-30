import { UserData } from "./types";

export const initialData: Record<string, UserData> = {
  "/": {
    root: { props: { title: "Puck Example", bodyFont: "system", fontOption1: "system", fontOption2: "system" } },
    zones: {},
    content: [
      // ── Section 1: Hero ──────────────────────────────────────────────────
      {
        type: "Section",
        props: {
          id: "Section-hero",
          paddingTop: "0px",
          paddingBottom: "0px",
          paddingHorizontal: "0px",
          backgroundColor: "#ffffff",
          theme: "dark",
          maxWidth: "100%",
          content: [
            {
              type: "Hero",
              props: {
                id: "Hero-1687283596554",
                title: "This page was built with Puck",
                description:
                  "<p>Puck is the self-hosted visual editor for React. Bring your own components and make site changes instantly, without a deploy.</p>",
                buttons: [
                  {
                    label: "Visit GitHub",
                    href: "https://github.com/puckeditor/puck",
                  },
                  {
                    label: "Edit this page",
                    href: "/edit",
                    variant: "secondary",
                  },
                ],
                image: {
                  url: "https://images.unsplash.com/photo-1687204209659-3bded6aecd79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
                  mode: "inline",
                  content: [],
                },
                padding: "128px",
                align: "left",
              },
              readOnly: { title: false, description: false },
            },
          ],
        },
      },

      // ── Section 2: Features ──────────────────────────────────────────────
      {
        type: "Section",
        props: {
          id: "Section-features",
          paddingTop: "96px",
          paddingBottom: "96px",
          paddingHorizontal: "24px",
          backgroundColor: "#ffffff",
          theme: "dark",
          maxWidth: "1280px",
          content: [
            {
              type: "Heading",
              props: {
                id: "Heading-1687297593514",
                align: "center",
                level: "2",
                text: "Drag-and-drop your own React components",
                layout: { padding: "0px" },
                size: "xxl",
              },
            },
            {
              type: "Space",
              props: {
                id: "Space-features-sub",
                size: "16px",
                direction: "vertical",
              },
            },
            {
              type: "Text",
              props: {
                id: "Text-1687297621556",
                align: "center",
                text: "Configure Puck with your own components to make changes for your marketing pages without a developer.",
                layout: { padding: "0px" },
                size: "m",
                color: "muted",
              },
            },
            {
              type: "Space",
              props: {
                id: "Space-features-grid",
                size: "48px",
                direction: "vertical",
              },
            },
            {
              type: "Grid",
              props: {
                id: "Grid-c4cd99ae-8c5e-4cdb-87d2-35a639f5163e",
                gap: 24,
                numColumns: 3,
                items: [
                  {
                    type: "Card",
                    props: {
                      id: "Card-66ab42c9-d1da-4c44-9dba-5d7d72f2178d",
                      title: "Built for content teams",
                      description:
                        "Puck enables content teams to make changes to their content without a developer or breaking the UI.",
                      icon: "pen-tool",
                      mode: "flat",
                      layout: {
                        grow: true,
                        spanCol: 1,
                        spanRow: 1,
                        padding: "0px",
                      },
                    },
                  },
                  {
                    type: "Card",
                    props: {
                      id: "Card-0012a293-8ef3-4e7c-9d7c-7da0a03d97ae",
                      title: "Easy to integrate",
                      description:
                        "Front-end developers can easily integrate their own components using a familiar React API.",
                      icon: "git-merge",
                      mode: "flat",
                      layout: {
                        grow: true,
                        spanCol: 1,
                        spanRow: 1,
                        padding: "0px",
                      },
                    },
                  },
                  {
                    type: "Card",
                    props: {
                      id: "Card-09efb3f3-f58d-4e07-a481-7238d7e57ad6",
                      title: "No vendor lock-in",
                      description:
                        "Completely open-source, Puck is designed to be integrated into your existing React application.",
                      icon: "github",
                      mode: "flat",
                      layout: {
                        grow: true,
                        spanCol: 1,
                        spanRow: 1,
                        padding: "0px",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },

      // ── Section 3: Stats ─────────────────────────────────────────────────
      {
        type: "Section",
        props: {
          id: "Section-stats",
          paddingTop: "96px",
          paddingBottom: "96px",
          paddingHorizontal: "24px",
          backgroundColor: "#f0f2f5",
          theme: "dark",
          maxWidth: "1280px",
          content: [
            {
              type: "Heading",
              props: {
                id: "Heading-1687296574110",
                align: "center",
                level: "2",
                text: "The numbers",
                layout: { padding: "0px" },
                size: "xxl",
              },
            },
            {
              type: "Space",
              props: {
                id: "Space-stats-sub",
                size: "16px",
                direction: "vertical",
              },
            },
            {
              type: "Text",
              props: {
                id: "Text-1687284565722",
                align: "center",
                text: 'This page demonstrates Puck configured with a custom component library. This component is called "Stats", and contains some made-up numbers. You can configure any page by adding "/edit" onto the URL.',
                layout: { padding: "0px" },
                size: "m",
                color: "muted",
                maxWidth: "916px",
              },
            },
            {
              type: "Space",
              props: {
                id: "Space-stats-grid",
                size: "48px",
                direction: "vertical",
              },
            },
            {
              type: "Stats",
              props: {
                id: "Stats-1687297239724",
                items: [
                  { title: "Users reached", description: "20M+" },
                  { title: "Cost savings", description: "$1.5M" },
                  { title: "Another stat", description: "5M kg" },
                  { title: "Final fake stat", description: "15K" },
                ],
              },
            },
          ],
        },
      },

      // ── Section 4: Extending Puck ────────────────────────────────────────
      {
        type: "Section",
        props: {
          id: "Section-extending",
          paddingTop: "96px",
          paddingBottom: "96px",
          paddingHorizontal: "24px",
          backgroundColor: "#ffffff",
          theme: "dark",
          maxWidth: "1280px",
          content: [
            {
              type: "Heading",
              props: {
                id: "Heading-1687296184321",
                align: "center",
                level: "2",
                text: "Extending Puck",
                layout: { padding: "0px" },
                size: "xxl",
              },
            },
            {
              type: "Space",
              props: {
                id: "Space-ext-sub",
                size: "16px",
                direction: "vertical",
              },
            },
            {
              type: "Text",
              props: {
                id: "Text-1687296579834",
                align: "center",
                text: "Puck can also be extended with plugins and headless CMS content fields, transforming Puck into the perfect tool for your Content Ops.",
                layout: { padding: "0px" },
                size: "m",
                color: "muted",
                maxWidth: "916px",
              },
            },
            {
              type: "Space",
              props: {
                id: "Space-ext-grid",
                size: "48px",
                direction: "vertical",
              },
            },
            {
              type: "Grid",
              props: {
                id: "Grid-2da28e88-7b7b-4152-9da0-9f93f41213b6",
                gap: 24,
                numColumns: 3,
                items: [
                  {
                    type: "Card",
                    props: {
                      id: "Card-b0e8407d-9fbb-4e76-aa32-d32f655c11d3",
                      title: "plugin-heading-analyzer",
                      description:
                        "Analyze the document structure and identify WCAG 2.1 issues with your heading hierarchy.",
                      icon: "align-left",
                      mode: "card",
                      layout: {
                        grow: false,
                        spanCol: 1,
                        spanRow: 1,
                        padding: "0px",
                      },
                    },
                  },
                  {
                    type: "Card",
                    props: {
                      id: "Card-f8ebd568-3a30-4099-a068-22cabae4691b",
                      title: "External data",
                      description:
                        "Connect your components with an existing data source, like Strapi.js.",
                      icon: "feather",
                      mode: "card",
                      layout: {
                        grow: false,
                        spanCol: 1,
                        spanRow: 1,
                        padding: "0px",
                      },
                    },
                  },
                  {
                    type: "Card",
                    props: {
                      id: "Card-9c3b0acc-ee42-4a4a-8cc7-1b22d98493f1",
                      title: "Custom plugins",
                      description:
                        "Create your own plugin to extend Puck for your use case using React.",
                      icon: "plug",
                      mode: "card",
                      layout: {
                        grow: false,
                        spanCol: 1,
                        spanRow: 1,
                        padding: "0px",
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },

      // ── Section 5: Get started (CTA) ─────────────────────────────────────
      {
        type: "Section",
        props: {
          id: "Section-cta",
          paddingTop: "96px",
          paddingBottom: "96px",
          paddingHorizontal: "24px",
          backgroundColor: "#0f172a",
          theme: "light",
          maxWidth: "1280px",
          content: [
            {
              type: "Heading",
              props: {
                id: "Heading-1687299303766",
                align: "center",
                level: "2",
                text: "Get started",
                layout: { padding: "0px" },
                size: "xxl",
              },
            },
            {
              type: "Space",
              props: {
                id: "Space-cta-sub",
                size: "16px",
                direction: "vertical",
              },
            },
            {
              type: "Text",
              props: {
                id: "Text-1687299305686",
                align: "center",
                text: "Browse the Puck GitHub to get started, or try editing this page",
                layout: { padding: "0px" },
                size: "m",
                color: "muted",
              },
            },
            {
              type: "Space",
              props: {
                id: "Space-cta-btns",
                size: "32px",
                direction: "vertical",
              },
            },
            {
              type: "Flex",
              props: {
                id: "Flex-7d63d5ff-bd42-4354-b05d-681b16436fd6",
                justifyContent: "center",
                direction: "row",
                gap: 16,
                wrap: "wrap",
                layout: { spanCol: 1, spanRow: 1, padding: "0px" },
                items: [
                  {
                    type: "Button",
                    props: {
                      id: "Button-bd41007c-6627-414d-839a-e261d470d8f9",
                      label: "Visit GitHub",
                      href: "https://github.com/puckeditor/puck",
                      variant: "primary",
                    },
                  },
                  {
                    type: "Button",
                    props: {
                      id: "Button-6a5fa26c-8a2d-4b08-a756-c46079877127",
                      label: "Edit this page",
                      href: "/edit",
                      variant: "secondary",
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

  "/pricing": {
    content: [],
    root: { props: { title: "Pricing", bodyFont: "system", fontOption1: "system", fontOption2: "system" } },
  },

  "/about": {
    content: [],
    root: { props: { title: "About Us", bodyFont: "system", fontOption1: "system", fontOption2: "system" } },
  },
};
