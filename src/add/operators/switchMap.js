import proto, {defaultOnNext} from '../../proto'
import {baseCreate} from '../../core'

proto.switchMap = function switchMap(fn) {
  let subscription
  return baseCreate({
    next: function(x) {
      subscription && subscription.unsubscribe()

      const nestedStream = fn(x)

      subscription = nestedStream.subscribe(
        defaultOnNext.bind(null, this),
        this.error.bind(this)
      )
    }
  }, this, 'switchMap')
}
