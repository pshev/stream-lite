import proto, {defaultOnNext} from '../../core/proto'
import {baseCreate} from '../../core'

proto.mapTo = function mapTo(x) {
  return baseCreate({
    next: function() { defaultOnNext(this, x) }
  }, this, 'mapTo')
}
