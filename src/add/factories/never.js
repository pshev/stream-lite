import './create'
import statics from '../../statics'

statics.never = function never() {
  return statics.create({start: () => {}}, 'never')
}
