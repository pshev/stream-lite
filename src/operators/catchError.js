import {Stream, baseError} from '../internal'
import {toStream} from '../internal/helpers'

export const catchError = fn => stream => {
  let subscription

  return Stream({
    error(error) {
      let inner
      try {
        inner = fn(error)
      } catch (err) {
        baseError(this, err)
        return
      }

      subscription = toStream(inner).subscribe(
        this.next.bind(this),
        baseError.bind(null, this),
        this.complete.bind(this)
      )
    },
    onStop() {
      subscription && subscription.unsubscribe()
      subscription = null
    },
    dependencies: [stream]
  })
}
