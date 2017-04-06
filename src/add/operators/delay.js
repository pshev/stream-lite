import {proto, baseNext, baseComplete, baseCreate} from '../../core'

proto.delay = function delay(delay) {
  let sourceStreamHasCompleted
  let lastReceivedValue
  let lastEmittedValue

  return baseCreate({
    next: function(x) {
      lastReceivedValue = x
      setTimeout(() => {
        lastEmittedValue = x
        baseNext(this, x)
        if (sourceStreamHasCompleted)
          this.complete()
      }, delay)
    },
    complete: function() {
      sourceStreamHasCompleted = true
      if (lastReceivedValue === lastEmittedValue)
        baseComplete(this)
    },
    stop: function() {
      sourceStreamHasCompleted = false
      lastReceivedValue = undefined
      lastEmittedValue = undefined
    }
  }, this, 'delay')
}
