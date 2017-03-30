import {baseCreate} from '../../core'
import {defaultOnNext} from '../../core/proto'
import statics from '../../core/statics'

statics.combine = function combine(...streams) {
  return baseCreate({
    dependencies: streams,
    next: function() {
      defaultOnNext(this, this.dependencies.map(d => d.val))
    }
  })
}

statics.combineLatest = statics.combine
