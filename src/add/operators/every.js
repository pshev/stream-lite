import {proto, baseCreate, baseNext, baseComplete} from '../../core'

proto.every = function every(predicate = (() => true)) {
  let index = 0
  return baseCreate({
    next: function(x) {
      if (!predicate(x, index)) {
        baseNext(this, false)
        baseComplete(this)
      }
      index++
    },
    complete: function() {
      baseNext(this, true)
      baseComplete(this)
    },
    streamDeactivated: function() {
      index = 0
    }
  }, this)
}
