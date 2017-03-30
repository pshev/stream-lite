import './create'
import statics from '../../core/statics'

statics.empty = function empty() {
  return statics.create({start: self => self.complete()}, 'empty')
}
