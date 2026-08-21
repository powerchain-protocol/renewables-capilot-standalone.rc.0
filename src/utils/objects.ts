import clamp from "lodash/clamp";
import debounce from "lodash/debounce";
import pick from "lodash/pick";

export { clamp, debounce };

export function pickDefined<T extends object, K extends keyof T>(
  value: T,
  keys: readonly K[],
): Pick<T, K> {
  return pick(value, keys) as Pick<T, K>;
}

export function omitUndefined<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined),
  ) as Partial<T>;
}
