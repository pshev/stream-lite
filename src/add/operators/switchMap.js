import {baseCreate, baseNext, proto} from '../../core'

proto.switchMap = function switchMap(fn) {
  let subscription
  return baseCreate({
    next: function(x) {
      subscription && subscription.unsubscribe()

      const nestedStream = fn(x)

      subscription = nestedStream.subscribe(
        baseNext.bind(null, this),
        this.error.bind(this)
      )
    },
    streamDeactivated: function() {
      subscription && subscription.unsubscribe()
    }
  }, this, 'switchMap')
}
