import './create'
import statics from '../../core/statics'

statics.fromArray = function fromArray(xs) {
  return statics.create({start: self => {
    xs.forEach(i => self.next(i))
    self.complete()
  }}, 'fromArray')
}
