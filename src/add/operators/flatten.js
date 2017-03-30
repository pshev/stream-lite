import proto, {baseNext} from '../../core/proto'
import {baseCreate} from '../../core'

proto.flatten = function flatten() {
  let subscription
  return baseCreate({
    next: function(nestedStream) {
      subscription = nestedStream.subscribe(
        baseNext.bind(null, this),
        this.error.bind(this)
      )
    },
    streamDeactivated: function() {
      subscription && subscription.unsubscribe()
    }
  }, this, 'flatten')
}
