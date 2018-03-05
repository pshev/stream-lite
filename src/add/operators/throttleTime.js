import {proto} from '../../internal/stream'
import {throttleTime} from '../../operators/throttleTime'

proto.throttleTime = function(...args) {
	return throttleTime(...args)(this)
}
