import {create} from '../core'

export const range = (start = 0, count = 0) =>
  create({
    start: self => {
      for (let i = start; i < start + count; i++)
        self.next(i)

      self.complete()
    }
  })
