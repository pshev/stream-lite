import {baseCreate, baseNext, proto} from '../../core'

proto.distinctUntilChanged = function() {
  let lastValue
  return baseCreate({
    next(x) {
      if (x !== lastValue) {
        baseNext(this, x)
        lastValue = x
      }
    },
    stop() {
      lastValue = undefined
    }
  }, this)
}
