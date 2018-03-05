import {proto} from '../../internal/stream'
import {single} from '../../operators/single'

proto.single = function(...args) {
	return single(...args)(this)
}
