import {Stream} from '../internal'

export const merge = (...streams) =>
  Stream({dependencies: streams})
