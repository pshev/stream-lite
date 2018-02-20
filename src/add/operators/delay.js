import {proto} from '../../core'
import {delay} from '../../operators/delay'

proto.delay = function(...args) {
	return delay(...args)(this)
}
