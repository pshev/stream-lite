import {proto, baseNext} from '../../core'
import {baseCreate} from '../../core'

proto.take = function take(numberToTake) {
  let taken = 0

  return baseCreate({
    next: function(x) {
      if (taken < numberToTake) {
        baseNext(this, x)

        taken++

        if (taken === numberToTake) {
          this.complete()
        }
      }
    }
  }, this, 'take')
}
