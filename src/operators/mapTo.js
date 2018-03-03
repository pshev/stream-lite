import {Stream, baseNext} from '../internal'


export const mapTo = x => stream =>
  Stream({
    next() { baseNext(this, x) }
  }, stream)
