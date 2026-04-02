import React, { MouseEvent } from "react";
import { ComponentConfig, Fields } from "@/core/types";
import { Button as _Button } from "@/core/components/Button";
import {
  type ButtonAction,
  BUTTON_ACTION_OPTIONS,
  buttonActionLabel,
} from "../../content/button-actions";

export type ButtonProps = {
  label: string;
  buttonAction: ButtonAction;
  href: string;
  variant: "primary" | "secondary";
};

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

export const Button: ComponentConfig<ButtonProps> = {
  label: "Button",
  fields: buttonFields,
  defaultProps: {
    label: "Button",
    buttonAction: "link",
    href: "#",
    variant: "primary",
  },
  resolveFields: (data) => {
    const action = data.props?.buttonAction ?? "link";
    if (action === "link") return buttonFields;
    const { href: _h, ...rest } = buttonFields;
    return rest as Fields<ButtonProps>;
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
