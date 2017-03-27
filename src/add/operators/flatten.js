import proto, {defaultOnNext} from '../../proto'
import {baseCreate} from '../../core'

proto.flatten = function flatten() {
  return baseCreate({
    next: function(nestedStream) {
      nestedStream.subscribe(
        defaultOnNext.bind(null, this),
        this.error.bind(this)
      )
    }
  }, this, 'flatten')
}
