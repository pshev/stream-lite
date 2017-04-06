import {proto, baseCreate, baseNext, baseComplete} from '../../core'

proto.last = function last(predicate, projectionFn = (x => x), defaultValue) {
  predicate = predicate || (() => true)
  let index = 0
  let lastToPassThePredicate
  return baseCreate({
    next: function(x) {
      if (predicate(x, index))
        lastToPassThePredicate = { value: x, index }
      index++
    },
    complete: function() {
      const x = lastToPassThePredicate
        ? projectionFn(lastToPassThePredicate.value, lastToPassThePredicate.index)
        : defaultValue
      baseNext(this, x)
      baseComplete(this)
    },
    stop: function() {
      index = 0
      lastToPassThePredicate = null
    }
  }, this)
}
