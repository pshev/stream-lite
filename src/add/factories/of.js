import './create'
import {statics} from '../../core'

statics.of = function of(...xs) {
  return statics.create({start: self => {
    xs.forEach(i => self.next(i))
    self.complete()
  }}, 'of')
}
