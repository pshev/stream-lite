import proto from '../../proto'
import '../statics/combine'
import statics from '../../statics'

proto.combine = function combine(...streams) {
  return statics.combine(this, ...streams)
}
