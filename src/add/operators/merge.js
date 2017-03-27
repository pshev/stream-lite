import proto from '../../proto'
import '../statics/merge'
import statics from '../../statics'

proto.merge = function merge(...streams) {
  return statics.merge(this, ...streams)
}
