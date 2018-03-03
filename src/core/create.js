import {Stream} from '../internal'
import {Producer} from './producer'

export const create = producer =>
  Stream({producer: Producer(producer)})
