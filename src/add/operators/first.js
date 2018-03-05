import {proto} from '../../internal/stream'
import {first} from '../../operators/first'

proto.first = function(...args) {
	return first(...args)(this)
}
