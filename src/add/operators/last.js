import {proto} from '../../internal/stream'
import {last} from '../../operators/last'

proto.last = function(...args) {
	return last(...args)(this)
}
