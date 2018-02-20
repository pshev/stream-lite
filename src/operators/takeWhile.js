import {baseCreate, baseNext} from '../internal'

export const takeWhile = predicate => stream =>
  baseCreate({
    next(x) {
      if (predicate(x))
        baseNext(this, x)
      else
        this.complete()
    }
  }, stream)
