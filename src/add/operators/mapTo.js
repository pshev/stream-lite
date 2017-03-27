import proto, {defaultOnNext} from '../../proto'
import {baseCreate} from '../../core'

proto.mapTo = function mapTo(x) {
  return baseCreate({
    next: function() { defaultOnNext(this, x) }
  }, this, 'mapTo')
}
