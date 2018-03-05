import {proto} from '../../internal/stream'
import {delay} from '../../operators/delay'

proto.delay = function(...args) {
	return delay(...args)(this)
}
