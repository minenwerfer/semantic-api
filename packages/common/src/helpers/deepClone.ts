export const deepClone = (obj: object) => {
  return 'structuredClone' in global
    ? structuredClone(obj)
    : JSON.parse(JSON.stringify(obj))
}
