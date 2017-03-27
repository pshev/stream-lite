import './create'
import statics from '../../statics'

statics.of = function of(...xs) {
  return statics.create({start: consumer => xs.forEach(i => consumer.next(i))}, 'of')
}
