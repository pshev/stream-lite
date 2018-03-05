import {proto} from '../../internal/stream'
import {skipUntil} from '../../operators/skipUntil'

proto.skipUntil = function(...args) {
	return skipUntil(...args)(this)
}
