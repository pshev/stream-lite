import {proto} from '../../core'
import {bufferWhen} from '../../operators/bufferWhen'

proto.bufferWhen = function(...args) {
	return bufferWhen(...args)(this)
}
