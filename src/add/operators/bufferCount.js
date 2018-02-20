import {proto} from '../../core'
import {bufferCount} from '../../operators/bufferCount'

proto.bufferCount = function(...args) {
	return bufferCount(...args)(this)
}
