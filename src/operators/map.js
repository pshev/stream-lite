import {baseCreate, baseNext} from '../internal'
import {_try, ERROR} from '../util/try'

export const map = f => stream =>
  baseCreate({
    next(x) {
      const result = _try(this, () => f(x))
      if (result !== ERROR)
        baseNext(this, result)
    }
  }, stream)
