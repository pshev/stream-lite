import {proto, baseCreate, baseNext, baseComplete} from '../../core'

proto.last = function last(predicate, projectionFn = (x => x), defaultValue) {
  predicate = predicate || (() => true)
  let index = 0
  let lastToPassThePredicate
  return baseCreate({
    next(x) {
      if (predicate(x, index))
        lastToPassThePredicate = { value: x, index }
      index++
    },
    complete() {
      const x = lastToPassThePredicate
        ? this.tryGetResult(projectionFn.bind(this, lastToPassThePredicate.value, lastToPassThePredicate.index))
        : defaultValue
      baseNext(this, x)
      baseComplete(this)
    },
    stop() {
      index = 0
      lastToPassThePredicate = null
    },
    tryGetResult(fn) {
      try {
        return fn()
      } catch (e) {
        this.error(e)
      }
    }
  }, this)
}
