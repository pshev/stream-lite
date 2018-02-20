import {map} from './map'

export const withValue = fn => stream =>
  stream.pipe(map(x => [x, fn(x)]))
