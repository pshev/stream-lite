import {baseCreate} from '../../core'
import statics from '../../statics'

statics.create = function create(producer = {}, name) {
  producer.start = producer.start || (() => {})
  producer.stop = producer.stop || (() => {})
  return baseCreate({producer}, undefined, name)
}
