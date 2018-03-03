import {baseCreate, baseNext} from '../internal'
import {_try, ERROR} from '../util/try'

export const filter = f => stream =>
  baseCreate({
    next(x) {
      const condition = _try(this, () => f(x))
      if (condition !== ERROR && condition)
        baseNext(this, x)
    }
  }, stream)
