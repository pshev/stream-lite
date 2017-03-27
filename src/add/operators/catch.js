import proto, {defaultOnNext, defaultOnError} from '../../proto'
import {baseCreate} from '../../core'

proto.catch = function catchOperator(fn) {
  return baseCreate({
    error: function(error) {
      const nestedStream = fn(error)

      nestedStream.subscribe(
        defaultOnNext.bind(null, this),
        defaultOnError.bind(null, this),
        this.complete.bind(this)
      )
    }
  }, this, 'catch')
}
