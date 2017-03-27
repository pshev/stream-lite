import proto, {defaultOnNext} from '../../proto'
import {baseCreate} from '../../core'

proto.pluck = function pluck(prop) {
  return baseCreate({
    next: function(x) { defaultOnNext(this, x[prop]) }
  }, this, 'pluck')
}
