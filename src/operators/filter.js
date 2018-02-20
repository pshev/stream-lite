import {baseCreate, baseNext} from '../internal'

export const filter = f => stream =>
  baseCreate({
    next(x) {
      if (f(x))
        baseNext(this, x)
    }
  }, stream)
