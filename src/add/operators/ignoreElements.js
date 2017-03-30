import proto from '../../core/proto'
import {baseCreate} from '../../core'

proto.ignoreElements = function ignoreElements() {
  return baseCreate({next: () => {}}, this)
}
