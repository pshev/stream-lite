import {Stream, Producer} from '../internal'

export const create = producer =>
  Stream({producer: Producer(producer)})
