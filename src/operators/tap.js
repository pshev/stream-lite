import {Stream, baseNext} from '../internal'
import {_try, ERROR} from '../util/try'

export const tap = f => stream =>
  Stream({
    next(x) {
      const result = _try(this, () => f(x))
      if (result !== ERROR)
        baseNext(this, x)
    }
  }, stream)
