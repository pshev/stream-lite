import {proto, baseNext, baseComplete, baseCreate} from '../../core'

proto.delay = function delay(delay) {
  let sourceStreamHasCompleted
  let lastReceivedValue
  let lastEmittedValue

  return baseCreate({
    next(x) {
      lastReceivedValue = x
      setTimeout(() => {
        lastEmittedValue = x
        baseNext(this, x)
        if (sourceStreamHasCompleted)
          this.complete()
      }, delay)
    },
    complete() {
      sourceStreamHasCompleted = true
      if (lastReceivedValue === lastEmittedValue)
        baseComplete(this)
    },
    stop() {
      sourceStreamHasCompleted = false
      lastReceivedValue = undefined
      lastEmittedValue = undefined
    }
  }, this, 'delay')
}
