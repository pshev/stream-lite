import {proto} from '../../internal/stream'
import {concat} from '../../operators/concat'

proto.concat = function(...args) {
	return concat(...args)(this)
}
