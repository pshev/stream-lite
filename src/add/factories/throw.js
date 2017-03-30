import './create'
import statics from '../../core/statics'

statics['throw'] = function throwOperator(err) {
  return statics.create({start: self => self.error(err)}, 'throw')
}
