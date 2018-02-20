import {proto} from '../../core'
import {tap} from '../../operators/tap'

proto.tap = function(...args) {
	return tap(...args)(this)
}
