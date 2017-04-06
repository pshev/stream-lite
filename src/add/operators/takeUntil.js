import {proto} from '../../core'
import {baseCreate} from '../../core'

proto.takeUntil = function takeUntil(stream) {
  let subscription

  return baseCreate({
    start() {
      subscription = stream.subscribe(
        this.complete.bind(this),
        this.error.bind(this)
      )
    },
    stop() {
      subscription && subscription.unsubscribe()
      subscription = undefined
    }
  }, this)
}
