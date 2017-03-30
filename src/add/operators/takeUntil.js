import {proto} from '../../core'
import {baseCreate} from '../../core'

proto.takeUntil = function takeUntil(stream) {
  let subscription

  return baseCreate({
    streamActivated: function() {
      subscription = stream.subscribe(
        this.complete.bind(this),
        this.error.bind(this)
      )
    },
    streamDeactivated: function() {
      subscription && subscription.unsubscribe()
    }
  }, this)
}
