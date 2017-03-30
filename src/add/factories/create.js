import {baseCreate} from '../../core'
import statics from '../../core/statics'

statics.create = function create(producer = {}, name) {
  producer.start = producer.start || (() => {})
  producer.stop = producer.stop || (() => {})
  return baseCreate({producer}, undefined, name)
}
