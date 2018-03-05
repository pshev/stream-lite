import {proto} from '../../internal/stream'
import {throttle} from '../../operators/throttle'

proto.throttle = function(...args) {
	return throttle(...args)(this)
}
