import {baseCreate, baseNext} from '../internal'


export const mapTo = x => stream =>
  baseCreate({
    next() { baseNext(this, x) }
  }, stream)
