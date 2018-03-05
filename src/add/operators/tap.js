import {proto} from '../../internal/stream'
import {tap} from '../../operators/tap'

proto.tap = function(...args) {
	return tap(...args)(this)
}
