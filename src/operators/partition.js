import {filter} from './filter'

export const partition = predicate => stream =>
  [
    filter(predicate)(stream),
    filter(x => !predicate(x))(stream)
  ]
