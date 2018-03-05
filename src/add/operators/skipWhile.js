import {proto} from '../../internal/stream'
import {skipWhile} from '../../operators/skipWhile'

proto.skipWhile = function(...args) {
	return skipWhile(...args)(this)
}
