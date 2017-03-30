import proto, {baseNext} from '../../core/proto'
import {baseCreate} from '../../core'

proto.takeWhile = function takeWhile(predicate) {
  return baseCreate({
    next: function(x) {
      if (predicate(x))
        baseNext(this, x)
      else
        this.complete()
    }
  }, this, 'takeWhile')
}
