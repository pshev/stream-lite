import {baseNext, baseCreate} from '../internal'

export const scan = (f, acc) => stream => {
  const fn = x => (acc = f(acc, stream.val))

  return baseCreate({
    next(x) {
      baseNext(this, fn(x))
    }
  }, stream)
}
