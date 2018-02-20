import {create} from '../core'

const generateRange = (start, count) => Array.from({length: count}, (v, i) => i + start)

export const range = (start = 0, count = 0) =>
  create({
    start: self => {
      generateRange(start, count).forEach(i => self.next(i))
      self.complete()
    }
  })
