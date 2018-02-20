export function baseNext(stream, x) {
  stream.hasEmitted = true
  stream.val = x
  stream.subscribers.forEach(s => s.next(x))
  stream.dependents.forEach(s => s.next(x))
  return stream
}

export const baseNextGuard = stream => stream.active === true
