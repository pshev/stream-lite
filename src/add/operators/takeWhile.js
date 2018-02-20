import {proto} from '../../core'
import {takeWhile} from '../../operators/takeWhile'

proto.takeWhile = function(...args) {
	return takeWhile(...args)(this)
}
