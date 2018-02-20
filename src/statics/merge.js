import {baseCreate} from '../internal'

export const merge = (...streams) =>
  baseCreate({dependencies: streams})
