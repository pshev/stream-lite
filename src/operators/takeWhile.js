import {Stream, baseNext} from '../internal'
import {_try, ERROR} from '../util/try'

export const takeWhile = predicate => stream =>
  Stream({
    next(x) {
      const condition = _try(this, () => predicate(x))

      if (condition !== ERROR && condition)
        baseNext(this, x)
      else
        this.complete()
    }
  }, stream)
