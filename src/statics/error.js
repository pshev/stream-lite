import {create} from '../core'

export const error = err =>
  create({start: self => self.error(err)})
