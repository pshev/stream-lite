import {proto} from '../../internal/stream'
import {takeWhile} from '../../operators/takeWhile'

proto.takeWhile = function(...args) {
	return takeWhile(...args)(this)
}
