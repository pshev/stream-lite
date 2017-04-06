import {proto, baseNext} from '../../core'
import {baseCreate} from '../../core'

proto.takeWhile = function takeWhile(predicate) {
  return baseCreate({
    next(x) {
      if (predicate(x))
        baseNext(this, x)
      else
        this.complete()
    }
  }, this, 'takeWhile')
}
