import {baseCreate} from '../internal'

export const create = (producer = {}) => {
  producer.start = producer.start || (() => {})
  producer.stop = producer.stop || (() => {})
  return baseCreate({producer})
}
