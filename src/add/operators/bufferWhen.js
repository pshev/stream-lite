import {proto, baseNext, baseCreate, statics} from '../../core'

proto.bufferWhen = function bufferWhen(fn) {
  let subscription = null
  let buffered = []
  const toStream = s => s.then ? statics.fromPromise(s) : s

  return baseCreate({
    next(x) {
      buffered.push(x)
    },
    onStart() {
      this.subscribeToChild()
    },
    subscribeToChild() {
      subscription && subscription.unsubscribe()
      subscription = toStream(fn()).subscribe(
        _ => {
          baseNext(this, buffered)
          buffered = []
          this.subscribeToChild()
        },
        this.error.bind(this),
        this.complete.bind(this)
      )
    },
    onStop() {
      subscription && subscription.unsubscribe()
      subscription = null
      buffered = []
    }
  }, this, 'bufferWhen')
}
