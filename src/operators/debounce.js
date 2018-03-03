import {baseNext, baseComplete, Stream} from '../internal'
import {toStream} from '../internal/helpers'
import {_try, ERROR} from '../util/try'

export const debounce = fn => stream => {
  let subscription = null
  let lastValue = null

  return Stream({
    next(x) {
      lastValue = x

      subscription && subscription.unsubscribe()

      const inner = _try(this, () => fn(x))
      if (inner === ERROR) return

      subscription = toStream(inner).subscribe(
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
    },
    dependencies: [stream]
  })
}
