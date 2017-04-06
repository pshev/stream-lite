import {baseCreate, baseNext, proto} from '../../core'

proto.distinctUntilChanged = function() {
  let lastValue
  return baseCreate({
    next: function(x) {
      if (x !== lastValue) {
        baseNext(this, x)
        lastValue = x
      }
    },
    stop: function() {
      lastValue = undefined
    }
  }, this)
}
