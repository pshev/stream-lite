import {baseCreate, proto} from '../../core'

proto.ignoreElements = function ignoreElements() {
  return baseCreate({next: () => {}}, this)
}
