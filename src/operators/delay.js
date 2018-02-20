import {baseNext, baseComplete, baseCreate} from '../internal'

export const delay = timeout => stream => {
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
      }, timeout)
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
  }, stream)
}
