import proto, {baseNext} from '../../core/proto'
import {baseCreate} from '../../core'

proto.mapTo = function mapTo(x) {
  return baseCreate({
    next: function() { baseNext(this, x) }
  }, this, 'mapTo')
}
