import proto, {defaultOnNext} from '../../core/proto'
import {baseCreate} from '../../core'

proto.startWith = function startWith(...xs) {
  return baseCreate({
    streamActivated: function() {
      xs.forEach(x => defaultOnNext(this, x))
    }
  }, this, 'startWith')
}
