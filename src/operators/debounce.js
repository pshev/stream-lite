import {baseNext, baseComplete, baseCreate} from '../internal'
import {toStream} from '../internal/helpers'

export const debounce = fn => stream => {
  let subscription = null
  let lastValue = null

  return baseCreate({
    next(x) {
      lastValue = x

      subscription && subscription.unsubscribe()

      subscription = toStream(fn(x)).subscribe(
        _ => baseNext(this, lastValue),
        this.error.bind(this)
      )
    },
    complete() {
      subscription && subscription.unsubscribe()
      baseNext(this, lastValue)
      baseComplete(this)
    },
    onStop() {
      subscription && subscription.unsubscribe()
      lastValue = null
      subscription = null
    }
  }, stream)
}
