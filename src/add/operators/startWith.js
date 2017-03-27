import proto, {defaultOnNext} from '../../proto'
import {baseCreate} from '../../core'

proto.startWith = function startWith(x) {
  return baseCreate({
    streamActivated: function() {
      defaultOnNext(this, x)
    }
  }, this, 'startWith')
}
