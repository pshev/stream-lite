import {proto} from '../../core'
import {baseCreate} from '../../core'

proto.takeUntil = function takeUntil(stream) {
  let subscription

  return baseCreate({
    start: function() {
      subscription = stream.subscribe(
        this.complete.bind(this),
        this.error.bind(this)
      )
    },
    stop: function() {
      subscription && subscription.unsubscribe()
      subscription = undefined
    }
  }, this)
}
