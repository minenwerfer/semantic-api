export const arraysIntersects = <T extends Array<string>>(subject: T|string, arr: T) => {
  return Array.isArray(subject)
    ? subject.some((e) => arr.includes(e))
    : arr.includes(subject)
}
