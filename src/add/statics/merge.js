import {baseCreate} from '../../core'
import statics from '../../core/statics'

statics.merge = function merge(...streams) {
  return baseCreate({
    dependencies: streams,
    baseNextGuard: function() {
      return this.shouldEmit === true
    }
  }, undefined, 'merge')
}
