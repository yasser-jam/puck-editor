import {
  ComponentConfig,
  ComponentConfigParams,
  DefaultComponentProps,
} from "@/core/types";
import type { LeftOrExactRight } from "@/core/types/Internal";
import { getClassNameFactory } from "@/core/lib";
import { Layout } from "./Layout.client";
import { LayoutBoxField } from "./LayoutField";
import styles from "./styles.module.css";
import {
  defaultLayoutValue,
  type LayoutCustomField,
  type LayoutFieldProps,
  type LayoutVisibility,
} from "./layout-shared";

export type { FloatPresetKey, WithLayout } from "./layout-shared";
export { getFloatInsetStyleFromPreset } from "./layout-shared";

const getClassName = getClassNameFactory("Layout", styles);

export const layoutField: LayoutCustomField = {
  type: "custom",
  label: "Layout",
  showSpanCol: true,
  showSpanRow: true,
  showGrow: false,
  maxSpanCol: 12,
  render: (props) => <LayoutBoxField {...props} field={layoutField} />,
};

export { Layout };

const createLayoutField = (
  visibility: LayoutVisibility = {}
): LayoutCustomField => ({
  ...layoutField,
  ...visibility,
  render: (props) => (
    <LayoutBoxField {...props} field={{ ...layoutField, ...visibility }} />
  ),
});

export function withLayout<
  Props extends LeftOrExactRight<
    Props,
    DefaultComponentProps,
    ComponentConfigParams
  >
>(componentConfig: ComponentConfig<Props>): ComponentConfig<Props> {
  return {
    ...componentConfig,
    fields: {
      ...componentConfig.fields,
      layout: layoutField,
    },
    defaultProps: {
      ...componentConfig.defaultProps,
      layout: {
        ...defaultLayoutValue,
        ...componentConfig.defaultProps?.layout,
      },
    },
    resolveFields: (_, params) => {
      if (params.parent?.type === "Grid") {
        return {
          ...componentConfig.fields,
          layout: createLayoutField({
            showSpanCol: true,
            showSpanRow: true,
            showGrow: false,
            maxSpanCol: 12,
          }),
        };
      }
      if (params.parent?.type === "Section") {
        return {
          ...componentConfig.fields,
          layout: createLayoutField({
            showSpanCol: true,
            showSpanRow: true,
            showGrow: false,
            maxSpanCol: 6,
          }),
        };
      }
      if (params.parent?.type === "Flex") {
        return {
          ...componentConfig.fields,
          layout: createLayoutField({
            showSpanCol: false,
            showSpanRow: false,
            showGrow: true,
          }),
        };
      }

      return {
        ...componentConfig.fields,
        layout: createLayoutField({
          showSpanCol: false,
          showSpanRow: false,
          showGrow: false,
        }),
      };
    },
    inline: true,
    render: (props: Parameters<typeof componentConfig.render>[0]) => {
      const layoutProps = props as Parameters<
        typeof componentConfig.render
      >[0] & { layout?: LayoutFieldProps };
      return (
        <Layout
          className={getClassName()}
          layout={layoutProps.layout as LayoutFieldProps}
          ref={layoutProps.puck.dragRef}
          puckIsEditing={layoutProps.puck?.isEditing === true}
        >
          {componentConfig.render(props as never)}
        </Layout>
      );
    },
  } as ComponentConfig<Props>;
}
