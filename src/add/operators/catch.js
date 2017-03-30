import {proto, baseNext, baseError} from '../../core'
import {baseCreate} from '../../core'

proto.catch = function catchOperator(fn) {
  return baseCreate({
    error: function(error) {
      const nestedStream = fn(error)

      nestedStream.subscribe(
        baseNext.bind(null, this),
        baseError.bind(null, this),
        this.complete.bind(this)
      )
    }
  }, this, 'catch')
}
