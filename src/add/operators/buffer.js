import {proto, baseNext, baseCreate, statics} from '../../core'

proto.buffer = function buffer(stream) {
  let subscription = null
  let buffered = []
  const toStream = s => s.then ? statics.fromPromise(s) : s

  return baseCreate({
    next(x) {
      buffered.push(x)
    },
    start() {
      subscription = toStream(stream).subscribe(
        _ => {
          baseNext(this, buffered)
          buffered = []
        },
        this.error.bind(this),
        this.complete.bind(this)
      )
    },
    stop() {
      subscription && subscription.unsubscribe()
      subscription = null
      buffered = []
    }
  }, this, 'buffer')
}
