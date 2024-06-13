export default function deepCopy(obj: any) {
  return obj && JSON.parse(JSON.stringify(obj))
}