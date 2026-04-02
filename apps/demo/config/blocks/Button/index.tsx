import React, { MouseEvent } from "react";
import { ComponentConfig, Fields } from "@/core/types";
import { Button as _Button } from "@/core/components/Button";
import {
  type ButtonAction,
  BUTTON_ACTION_OPTIONS,
  buttonActionLabel,
} from "../../content/button-actions";
import { WithLayout, withLayout } from "../../components/Layout";

export type ButtonProps = WithLayout<{
  label: string;
  buttonAction: ButtonAction;
  href: string;
  variant: "primary" | "secondary";
}>;

const buttonFields = {
  label: {
    type: "text" as const,
    placeholder: "Lorem ipsum...",
    contentEditable: true,
  },
  buttonAction: {
    type: "select" as const,
    label: "Action",
    options: BUTTON_ACTION_OPTIONS,
  },
  href: { type: "text" as const, label: "Link URL" },
  variant: {
    type: "radio" as const,
    options: [
      { label: "primary", value: "primary" },
      { label: "secondary", value: "secondary" },
    ],
  },
};

function filterButtonHrefFields(
  fields: Fields<ButtonProps>,
  data: { props?: { buttonAction?: ButtonAction } }
): Fields<ButtonProps> {
  const action = data.props?.buttonAction ?? "link";
  if (action === "link") return fields;
  const { href: _h, ...rest } = fields as Record<string, unknown>;
  return rest as Fields<ButtonProps>;
}

const ButtonInner: ComponentConfig<ButtonProps> = {
  label: "Button",
  fields: buttonFields,
  defaultProps: {
    label: "Button",
    buttonAction: "link",
    href: "#",
    variant: "primary",
  },
  render: ({ href, variant, label, buttonAction: actionProp, puck }) => {
    const buttonAction = actionProp ?? "link";
    const onFunctionalClick = (e: MouseEvent) => {
      e.preventDefault();
      if (puck.isEditing) return;
      window.alert(
        `Button action: ${buttonAction} — ${buttonActionLabel(buttonAction)}`
      );
    };

    if (buttonAction !== "link") {
      return (
        <div>
          <_Button
            type="button"
            variant={variant}
            size="large"
            tabIndex={puck.isEditing ? -1 : undefined}
            onClick={onFunctionalClick}
          >
            {label}
          </_Button>
        </div>
      );
    }

    return (
      <div>
        <_Button
          href={puck.isEditing ? "#" : href}
          variant={variant}
          size="large"
          tabIndex={puck.isEditing ? -1 : undefined}
        >
          {label}
        </_Button>
      </div>
    );
  },
};

const WithLayoutButton = withLayout(ButtonInner);

export const Button: typeof WithLayoutButton = {
  ...WithLayoutButton,
  resolveFields: (data, params) => {
    const base = (
      WithLayoutButton as { resolveFields?: (typeof WithLayoutButton)["resolveFields"] }
    ).resolveFields?.(data, params);
    if (base != null && typeof (base as Promise<unknown>).then === "function") {
      return (base as Promise<Fields<ButtonProps>>).then((f) =>
        filterButtonHrefFields(f, data)
      );
    }
    if (base == null) {
      return filterButtonHrefFields(
        ButtonInner.fields as Fields<ButtonProps>,
        data
      );
    }
    return filterButtonHrefFields(base as Fields<ButtonProps>, data);
  },
};
