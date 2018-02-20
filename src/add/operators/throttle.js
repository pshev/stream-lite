import {proto} from '../../core'
import {throttle} from '../../operators/throttle'

proto.throttle = function(...args) {
	return throttle(...args)(this)
}
