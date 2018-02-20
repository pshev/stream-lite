import {create} from '../core'

export const of = (...xs) =>
  create({
    start: self => {
      xs.forEach(i => self.next(i))
      self.complete()
    }
  })
