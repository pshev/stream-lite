import {baseCreate, proto, statics} from '../../core'

const merge = (...streams) => baseCreate({
  dependencies: streams,
  baseNextGuard: function() {
    return this.active === true
  }
})

statics.merge = merge

proto.merge = function(...streams) {
  return merge(this, ...streams)
}
