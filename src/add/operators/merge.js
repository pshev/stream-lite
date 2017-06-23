import {baseCreate, proto, statics} from '../../core'

const merge = (...streams) => baseCreate({ dependencies: streams })

statics.merge = merge

proto.merge = function(...streams) {
  return merge(this, ...streams)
}
