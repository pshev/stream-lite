import {isActive} from './helpers'

export const baseNextGuard = isActive

export function baseNext(stream, x) {
  stream.hasEmitted = true
  stream.val = x

  if (stream.subscribers.length) {
    if (stream.subscribers.length === 1)
      stream.subscribers[0].next(x)
    else
      stream.subscribers.forEach(s => s.next(x))
  }

  if (stream.dependents.length) {
    if (stream.dependents.length === 1)
      stream.dependents[0].next(x)
    else
      stream.dependents.forEach(s => s.next(x))
  }
}
