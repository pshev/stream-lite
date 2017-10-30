import {proto} from '../../core'
import {baseCreate} from '../../core'

proto.takeUntil = function takeUntil(stream) {
  let subscription

  return baseCreate({
    onStart() {
      subscription = stream.subscribe(
        this.complete.bind(this),
        this.error.bind(this)
      )
    },
    onStop() {
      subscription && subscription.unsubscribe()
      subscription = undefined
    }
  }, this)
}
