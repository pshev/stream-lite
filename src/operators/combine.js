import {combine as staticCombine} from '../statics'

export const combine = (...streams) => stream =>
  staticCombine(stream, ...streams)
