import {baseCreate} from '../../core'
import {defaultOnNext} from '../../proto'
import statics from '../../statics'

statics.combine = function combine(...streams) {
  return baseCreate({
    dependencies: streams,
    next: function() {
      defaultOnNext(this, this.dependencies.map(d => d.val))
    }
  })
}
