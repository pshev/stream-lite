import {proto} from '../../core'
import {skipWhile} from '../../operators/skipWhile'

proto.skipWhile = function(...args) {
	return skipWhile(...args)(this)
}
