import {proto} from '../../core'
import '../statics/combine'
import statics from '../../core/statics'

proto.combine = function combine(...streams) {
  return statics.combine(this, ...streams)
}

proto.combineLatest = proto.combine
