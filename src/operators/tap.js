import {baseCreate, baseNext} from '../internal'

export const tap = f => stream =>
  baseCreate({
    next(x) {
      f(x)
      baseNext(this, x)
    }
  }, stream)
