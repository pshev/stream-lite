import proto, {defaultOnNext} from '../../proto'
import {baseCreate} from '../../core'

proto.takeWhile = function takeWhile(predicate) {
  return baseCreate({
    next: function(x) {
      if (predicate(x))
        defaultOnNext(this, x)
      else
        this.complete()
    }
  }, this, 'takeWhile')
}
