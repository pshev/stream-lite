import './create'
import {statics} from '../../core'

statics.never = function never() {
  return statics.create({start: () => {}}, 'never')
}
