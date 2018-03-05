import {proto} from '../../internal/stream'
import {map} from '../../operators/map'

proto.map = function(...args) {
	return map(...args)(this)
}
