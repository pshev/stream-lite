import {proto, baseNext} from '../../core'
import {baseCreate} from '../../core'

proto.withLatestFrom = function withLatestFrom(s) {
  let sResult
  let subscription

  return baseCreate({
    next(x) {
      if (sResult)
        baseNext(this, [x, sResult])
    },
    onStart() {
      subscription = s.subscribe(
        x => sResult = x,
        this.error.bind(this)
      )
    },
    onStop() {
      subscription && subscription.unsubscribe()
      sResult = undefined
      subscription = undefined
    }
  }, this)
}
