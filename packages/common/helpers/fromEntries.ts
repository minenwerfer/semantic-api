export function fromEntries(entries: Array<any>): any {
  return entries.reduce((a, [key, value]) => ({ ...a, [key]: value }), {})
}
