import {create} from '../core'

export const never = () =>
  create({start: () => {}}, 'never')
