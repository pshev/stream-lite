import {proto} from '../../core'

proto.let = function(fn) {
  return fn(this)
}
