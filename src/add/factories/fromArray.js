import './create'
import statics from '../../statics'

statics.fromArray = function fromArray(xs) {
  return statics.create({start: self => xs.forEach(i => self.next(i))}, 'fromArray')
}
