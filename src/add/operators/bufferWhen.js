import {proto} from '../../internal/stream'
import {bufferWhen} from '../../operators/bufferWhen'

proto.bufferWhen = function(...args) {
	return bufferWhen(...args)(this)
}
