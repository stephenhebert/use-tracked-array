export default function debounce(fn: Function, delayMs: number) {
  let timer: number | null = null
  return function (...args: any[]) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
    }, delayMs)
  }
}