import config from "../config";
import type { UserData } from "../config/types";

type JsonRecord = Record<string, unknown>;
type ComponentDefaults = Record<string, { defaultProps?: JsonRecord }>;
type ComponentLike = {
  type: string;
  props: JsonRecord;
  readOnly?: unknown;
};

const isPlainObject = (value: unknown): value is JsonRecord => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const cloneDeep = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => cloneDeep(item)) as T;
  }

  if (isPlainObject(value)) {
    const next: JsonRecord = {};
    Object.entries(value).forEach(([key, itemValue]) => {
      next[key] = cloneDeep(itemValue);
    });

    return next as T;
  }

  return value;
};

const mergeDefaults = (defaults: unknown, incoming: unknown): unknown => {
  if (incoming === undefined) {
    return cloneDeep(defaults);
  }

  if (Array.isArray(defaults)) {
    return Array.isArray(incoming) ? incoming : cloneDeep(defaults);
  }

  if (isPlainObject(defaults) && isPlainObject(incoming)) {
    const next: JsonRecord = {};
    const keySet = new Set([
      ...Object.keys(defaults),
      ...Object.keys(incoming),
    ]);

    keySet.forEach((key) => {
      const defaultValue = defaults[key];
      const incomingValue = incoming[key];

      if (incomingValue === undefined) {
        next[key] = cloneDeep(defaultValue);
        return;
      }

      if (defaultValue === undefined) {
        next[key] = incomingValue;
        return;
      }

      next[key] = mergeDefaults(defaultValue, incomingValue);
    });

    return next;
  }

  return incoming;
};

const stripVisualOnlyKeys = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => stripVisualOnlyKeys(item));
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const next: JsonRecord = {};

  Object.entries(value).forEach(([key, itemValue]) => {
    if (key.startsWith("__")) {
      return;
    }

    next[key] = stripVisualOnlyKeys(itemValue);
  });

  return next;
};

const isComponentNode = (value: unknown): value is ComponentLike => {
  if (!isPlainObject(value)) {
    return false;
  }

  const itemType = value.type;
  const itemProps = value.props;

  return typeof itemType === "string" && isPlainObject(itemProps);
};

const normalizeNestedComponents = (
  value: unknown,
  components: ComponentDefaults
): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) =>
      isComponentNode(item)
        ? normalizeComponentNode(item, components)
        : normalizeNestedComponents(item, components)
    );
  }

  if (isComponentNode(value)) {
    return normalizeComponentNode(value, components);
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const next: JsonRecord = {};

  Object.entries(value).forEach(([key, itemValue]) => {
    next[key] = normalizeNestedComponents(itemValue, components);
  });

  return next;
};

const normalizeComponentNode = (
  item: ComponentLike,
  components: ComponentDefaults
): ComponentLike => {
  const defaultProps = components[item.type]?.defaultProps ?? {};
  const mergedProps = mergeDefaults(
    defaultProps,
    isPlainObject(item.props) ? item.props : {}
  );

  const cleanedProps = stripVisualOnlyKeys(mergedProps);

  const normalizedProps = normalizeNestedComponents(
    cleanedProps,
    components
  ) as JsonRecord;
  const fallbackId =
    typeof item.props.id === "string" ? item.props.id : item.type;

  return {
    ...item,
    props: {
      ...normalizedProps,
      id:
        typeof normalizedProps.id === "string"
          ? normalizedProps.id
          : fallbackId,
    },
  };
};

/**
 * Ensures the saved editor payload is serializable, forward-compatible, and
 * complete (root + block default props merged, plus visual-only keys removed).
 */
export function normalizeEditorData(
  value: Partial<UserData> | undefined | null
): UserData {
  const input = (value ?? {}) as Partial<UserData>;
  const components = config.components as ComponentDefaults;

  const rootDefaults = (config.root?.defaultProps ?? {}) as JsonRecord;
  const incomingRoot = isPlainObject(
    (input.root as JsonRecord | undefined)?.props
  )
    ? ((input.root as JsonRecord).props as JsonRecord)
    : isPlainObject(input.root)
    ? (input.root as JsonRecord)
    : {};

  const normalizedRootProps = normalizeNestedComponents(
    stripVisualOnlyKeys(mergeDefaults(rootDefaults, incomingRoot)),
    components
  ) as JsonRecord;

  const content = Array.isArray(input.content) ? input.content : [];

  return {
    ...input,
    root: {
      ...(isPlainObject(input.root) ? input.root : {}),
      props: normalizedRootProps,
    },
    content: content
      .filter((item) => isComponentNode(item))
      .map((item) =>
        normalizeComponentNode(item, components)
      ) as UserData["content"],
    zones: isPlainObject((input as JsonRecord).zones)
      ? ((input as JsonRecord).zones as UserData["zones"])
      : ({} as UserData["zones"]),
  } as UserData;
}
