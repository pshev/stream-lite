import {proto} from '../../internal/stream'
import {bufferCount} from '../../operators/bufferCount'

proto.bufferCount = function(...args) {
	return bufferCount(...args)(this)
}
