export function getStringValue(value: string | string[] | number | number[] | undefined) {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return `${value}`.trim();
  }

  if (Array.isArray(value) && value.length > 0) {
    return `${value[0]}`.trim();
  }

  // unknown. return undefined
  return undefined;
}
