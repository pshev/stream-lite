import proto from '../../core/proto'
import '../statics/merge'
import statics from '../../core/statics'

proto.merge = function merge(...streams) {
  return statics.merge(this, ...streams)
}
