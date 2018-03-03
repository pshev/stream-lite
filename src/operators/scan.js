import {baseNext, baseCreate} from '../internal'
import {_try, ERROR} from '../util/try'

export const scan = (f, acc) => stream => {
  const fn = x => (acc = f(acc, stream.val))

  return baseCreate({
    next(x) {
      const result = _try(this, () => fn(x))
      if (result !== ERROR)
        baseNext(this, result)
    }
  }, stream)
}
