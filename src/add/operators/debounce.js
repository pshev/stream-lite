import {proto, baseNext, baseComplete, baseCreate, statics} from '../../core'

proto.debounce = function debounce(fn) {
  let subscription = null
  let lastValue = null
  const toStream = s => s.then ? statics.fromPromise(s) : s

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
    stop() {
      subscription && subscription.unsubscribe()
      lastValue = null
      subscription = null
    }
  }, this, 'debounce')
}
