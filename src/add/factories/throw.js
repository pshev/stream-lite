import './create'
import statics from '../../statics'

statics['throw'] = function throwOperator(err) {
  return statics.create({start: consumer => consumer.error(err)}, 'throw')
}
