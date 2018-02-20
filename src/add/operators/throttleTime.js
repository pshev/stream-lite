import {proto} from '../../core'
import {throttleTime} from '../../operators/throttleTime'

proto.throttleTime = function(...args) {
	return throttleTime(...args)(this)
}
