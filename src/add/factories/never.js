import './create'
import statics from '../../core/statics'

statics.never = function never() {
  return statics.create({start: () => {}}, 'never')
}
