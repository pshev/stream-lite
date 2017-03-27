import './create'
import statics from '../../statics'

statics.empty = function empty() {
  return statics.create({start: consumer => consumer.complete()}, 'empty')
}
