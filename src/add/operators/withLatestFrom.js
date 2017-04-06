import {proto, baseNext} from '../../core'
import {baseCreate} from '../../core'

proto.withLatestFrom = function withLatestFrom(s) {
  let sResult
  let subscription

  return baseCreate({
    next: function(x) {
      if (sResult)
        baseNext(this, [x, sResult])
    },
    start: function() {
      subscription = s.subscribe(
        x => sResult = x,
        this.error.bind(this)
      )
    },
    stop: function() {
      subscription && subscription.unsubscribe()
      sResult = undefined
      subscription = undefined
    }
  }, this)
}
