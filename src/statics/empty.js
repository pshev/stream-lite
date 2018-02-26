import {create} from '../core'

export const empty = () =>
  create({start: self => self.complete()})
