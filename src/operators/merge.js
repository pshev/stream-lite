import {merge as staticMerge} from '../statics'

export const merge = (...streams) => stream =>
  staticMerge(stream, ...streams)
