import {baseCreate, baseNext, baseComplete, proto} from '../../core'

proto.first = function first(predicate, projectionFn = (x => x), defaultValue) {
  predicate = predicate || (() => true)
  let index = 0
  return baseCreate({
    next: function(x) {
      if (predicate(x, index)) {
        baseNext(this, projectionFn(x, index))
        baseComplete(this)
      }
      index++
    },
    complete: function() {
      baseNext(this, defaultValue)
      baseComplete(this)
    }
  }, this)
}
