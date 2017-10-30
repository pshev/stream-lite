import {proto, baseCreate, baseError} from '../../core'

proto.catch = function catchOperator(fn) {
  return baseCreate({
    error(error) {
      const nestedStream = fn(error)

      nestedStream.subscribe(
        this.next.bind(this),
        baseError.bind(null, this),
        this.complete.bind(this)
      )
    }
  }, this, 'catch')
}
