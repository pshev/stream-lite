import {baseCreate, baseNext} from '../internal'

export const pluck = (...props) => stream =>
  baseCreate({
    next(x) {
      baseNext(this, delve(x, props))
    }
  }, stream)

//taken from https://github.com/developit/dlv
function delve(obj, keys, def, p = 0) {
  while (obj && p < keys.length) obj = obj[keys[p++]]
  return obj === undefined ? def : obj
}