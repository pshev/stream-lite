import {baseCreate, proto, baseNext} from '../../core'

proto.skipUntil = function skipUntil(stream) {
  let subscription
  let shouldEmit = false

  return baseCreate({
    next(x) {
      if (shouldEmit) {
        baseNext(this, x)
        subscription.unsubscribe()
      }
    },
    start() {
      subscription = stream.subscribe(
        () => shouldEmit = true,
        this.error.bind(this)
      )
    },
    stop() {
      subscription && subscription.unsubscribe()
      shouldEmit = false
      subscription = undefined
    }
  }, this)
}
