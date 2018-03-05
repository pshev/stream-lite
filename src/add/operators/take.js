import {proto} from '../../internal/stream'
import {take} from '../../operators/take'

proto.take = function(...args) {
	return take(...args)(this)
}
