import './create'
import statics from '../../statics'

statics.fromArray = function fromArray(xs) {
  return statics.create({start: consumer => xs.forEach(i => consumer.next(i))}, 'fromArray')
}
