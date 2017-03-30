import proto, {defaultOnNext, defaultOnComplete} from '../../core/proto'
import {baseCreate} from '../../core'

proto.delay = function delay(delay) {
  let sourceStreamHasCompleted
  let lastReceivedValue
  let lastEmittedValue

  return baseCreate({
    next: function(x) {
      lastReceivedValue = x
      setTimeout(() => {
        lastEmittedValue = x
        defaultOnNext(this, x)
        if (sourceStreamHasCompleted)
          this.complete()
      }, delay)
    },
    complete: function() {
      sourceStreamHasCompleted = true
      if (lastReceivedValue === lastEmittedValue)
        defaultOnComplete(this)
    }
  }, this, 'delay')
}
