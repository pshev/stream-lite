import {proto} from '../../core'
import {skipUntil} from '../../operators/skipUntil'

proto.skipUntil = function(...args) {
	return skipUntil(...args)(this)
}
