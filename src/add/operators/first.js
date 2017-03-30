import proto, {defaultOnNext, defaultOnComplete} from '../../core/proto'
import {baseCreate} from '../../core'

proto.first = function first(predicate, projectionFn = (x => x), defaultValue) {
  predicate = predicate || (() => true)
  let index = 0
  return baseCreate({
    next: function(x) {
      if (predicate(x)) {
        defaultOnNext(this, projectionFn(x, index))
        defaultOnComplete(this)
      }
      index++
    },
    complete: function() {
      defaultOnNext(this, defaultValue)
      defaultOnComplete(this)
    }
  }, this)
}
