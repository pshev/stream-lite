import {proto} from '../../internal/stream'
import {buffer} from '../../operators/buffer'

proto.buffer = function(...args) {
	return buffer(...args)(this)
}
