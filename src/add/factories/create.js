import {baseCreate, statics} from '../../core'

statics.create = function create(producer = {}, name) {
  producer.start = producer.start || (() => {})
  producer.stop = producer.stop || (() => {})
  return baseCreate({producer}, undefined, name)
}
