import {proto} from '../../core'
import {buffer} from '../../operators/buffer'

proto.buffer = function(...args) {
	return buffer(...args)(this)
}
