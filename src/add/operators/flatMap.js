import './map'
import './flatten'
import proto from '../../proto'

proto.flatMap = function flatMap(fn) {
  return this.map(fn).flatten()
}
