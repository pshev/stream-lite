import './map'
import './flatten'
import {proto} from '../../core'

proto.flatMap = function flatMap(fn) {
  return this.map(fn).flatten()
}
