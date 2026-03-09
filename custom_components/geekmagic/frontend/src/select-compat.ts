/**
 * Backwards-compatible helpers for ha-select event handling.
 *
 * HA 2026.3+ rewrote ha-select: it now takes an `.options` property and fires
 * `@selected` with `{ value: string }`. Older versions used slotted
 * `<mwc-list-item>` children and fired `@selected` with `{ index: number }`.
 *
 * These helpers let us handle both event formats.
 */

export interface HaSelectOption {
  value: string;
  label: string;
}

/**
 * Resolve the selected value from an ha-select `@selected` event,
 * supporting both new (value-based) and old (index-based) event formats.
 *
 * @param detail - The event's detail object (e.detail from CustomEvent)
 * @param keys - Ordered array of option values (used for index-based lookup)
 * @returns The resolved value string, or undefined if resolution failed
 */
export function resolveSelectedValue(
  detail: { value?: string; index?: number },
  keys: string[]
): string | undefined {
  // New HA (2026.3+): detail.value is a string
  if (detail.value !== undefined && detail.value !== null) {
    return detail.value;
  }
  // Old HA: detail.index is a number
  if (detail.index !== undefined && detail.index !== null) {
    return keys[detail.index];
  }
  return undefined;
}

/**
 * Build an options array for the new ha-select `.options` property
 * from a Record of key→label entries.
 */
export function buildSelectOptions(
  entries: Record<string, string>
): HaSelectOption[] {
  return Object.entries(entries).map(([value, label]) => ({ value, label }));
}

/**
 * Build an options array with a leading placeholder entry.
 */
export function buildSelectOptionsWithEmpty(
  emptyLabel: string,
  entries: Record<string, string>
): HaSelectOption[] {
  return [{ value: "", label: emptyLabel }, ...buildSelectOptions(entries)];
}
