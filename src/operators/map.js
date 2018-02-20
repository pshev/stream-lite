import {baseCreate, baseNext} from '../internal'

export const map = f => stream =>
  baseCreate({
    next(x) {
      baseNext(this, f(x))
    }
  }, stream)
