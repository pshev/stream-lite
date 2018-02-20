import {concat as staticConcat} from '../statics'

export const concat = (...streams) => stream =>
  staticConcat(stream, ...streams)
