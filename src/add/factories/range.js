import {statics} from '../../core'

const generateRange = (start, count) => Array.from({length: count}, (v, i) => i + start)

statics.range = function range(start = 0, count = 0) {
  return statics.create({
    start: self => {
      generateRange(start, count).forEach(i => self.next(i))
      self.complete()
    }
  })
}
