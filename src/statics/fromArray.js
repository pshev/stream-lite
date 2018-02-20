import {create} from '../core'

export const fromArray = xs =>
  create({
    start: self => {
      xs.forEach(i => self.next(i))
      self.complete()
    }
  })
