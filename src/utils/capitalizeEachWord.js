export function capitalizeEachWord(str) {
  if (!str) return ''
  return str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
