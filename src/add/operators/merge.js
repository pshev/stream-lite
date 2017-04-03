import {baseCreate, proto, statics} from '../../core'

const merge = (...streams) => baseCreate({
  dependencies: streams,
  nextGuard: function() {
    return this.active === true
  }
})

statics.merge = merge

proto.merge = function(...streams) {
  return merge(this, ...streams)
}
