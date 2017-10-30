import {proto, baseNext, baseComplete, baseCreate} from '../../core'

proto.delay = function delay(delay) {
  let sourceStreamHasCompleted
  let numberOfValuesReceived = 0
  let numberOfValuesEmitted = 0

  return baseCreate({
    next(x) {
      numberOfValuesReceived++
      setTimeout(() => {
        numberOfValuesEmitted++
        baseNext(this, x)
        if (sourceStreamHasCompleted)
          this.complete()
      }, delay)
    },
    complete() {
      sourceStreamHasCompleted = true
      if (numberOfValuesReceived === numberOfValuesEmitted)
        baseComplete(this)
    },
    onStop() {
      sourceStreamHasCompleted = false
      numberOfValuesReceived = 0
      numberOfValuesEmitted = 0
    }
  }, this, 'delay')
}
