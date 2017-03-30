import {baseCreate} from '../../core'
import {baseNext} from '../../core/proto'
import statics from '../../core/statics'

statics.combine = function combine(...streams) {
  return baseCreate({
    dependencies: streams,
    next: function() {
      baseNext(this, this.dependencies.map(d => d.val))
    }
  })
}

statics.combineLatest = statics.combine
