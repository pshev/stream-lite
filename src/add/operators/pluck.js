import {baseCreate, baseNext, proto} from '../../core'

proto.pluck = function pluck(...props) {
  return baseCreate({
    next(x) { baseNext(this, delve(x, props)) }
  }, this, 'pluck')
}

//taken from https://github.com/developit/dlv
function delve(obj, keys, def, p = 0) {
  while (obj && p < keys.length) obj = obj[keys[p++]]
  return obj === undefined ? def : obj
}
