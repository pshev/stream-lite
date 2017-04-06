import {baseCreate, baseNext, proto} from '../../core'

proto.pluck = function pluck(prop) {
  return baseCreate({
    next(x) { baseNext(this, x[prop]) }
  }, this, 'pluck')
}
