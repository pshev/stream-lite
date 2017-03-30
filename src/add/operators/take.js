import proto, {defaultOnNext} from '../../core/proto'
import {baseCreate} from '../../core'

proto.take = function take(numberToTake) {
  let taken = 0

  return baseCreate({
    next: function(x) {
      if (taken < numberToTake) {
        defaultOnNext(this, x)

        taken++

        if (taken === numberToTake) {
          this.complete()
        }
      }
    }
  }, this, 'take')
}
