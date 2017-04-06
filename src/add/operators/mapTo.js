import {baseCreate, baseNext, proto} from '../../core'

proto.mapTo = function mapTo(x) {
  return baseCreate({
    next() { baseNext(this, x) }
  }, this, 'mapTo')
}
