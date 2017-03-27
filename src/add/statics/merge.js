import {baseCreate} from '../../core'
import {defaultOnNext} from '../../proto'
import statics from '../../statics'

statics.merge = function merge(...streams) {
  return baseCreate({
    dependencies: streams,
    next: function(x) {
      defaultOnNext(this, x)
    }
  })
}
