import {baseCreate} from '../../core'
import statics from '../../statics'

statics.merge = function merge(...streams) {
  return baseCreate({
    dependencies: streams,
    baseNextGuard: function() {
      return this.shouldEmit === true
    }
  }, undefined, 'merge')
}
