import {baseCreate} from '../internal'
import {Producer} from './producer'

export const create = producer =>
  baseCreate({producer: Producer(producer)})
