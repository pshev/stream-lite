import {Stream, baseNext} from '../internal'
import {_try, ERROR} from '../util/try'

export const filter = f => stream =>
  Stream({
    next(x) {
      const condition = _try(this, () => f(x))
      if (condition !== ERROR && condition)
        baseNext(this, x)
    },
    dependencies: [stream]
  })
