import proto, {baseNext} from '../../core/proto'
import {baseCreate} from '../../core'

proto.withLatestFrom = function withLatestFrom(s) {
  let sResult
  let subscription

  return baseCreate({
    next: function(x) {
      if (sResult)
        baseNext(this, [x, sResult])
    },
    streamActivated: function() {
      subscription = s.subscribe(
        x => sResult = x,
        this.error.bind(this)
      )
    },
    streamDeactivated: function() {
      subscription && subscription.unsubscribe()
    }
  }, this)
}
