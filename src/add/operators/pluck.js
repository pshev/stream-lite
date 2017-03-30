import proto, {baseNext} from '../../core/proto'
import {baseCreate} from '../../core'

proto.pluck = function pluck(prop) {
  return baseCreate({
    next: function(x) { baseNext(this, x[prop]) }
  }, this, 'pluck')
}
