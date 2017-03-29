import proto, {defaultOnNext} from '../../proto'
import {baseCreate} from '../../core'

proto.startWith = function startWith(...xs) {
  return baseCreate({
    streamActivated: function() {
      xs.forEach(x => defaultOnNext(this, x))
    }
  }, this, 'startWith')
}
