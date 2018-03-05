import {proto} from '../../internal/stream'
import {flatMap} from '../../operators/flatMap'

proto.flatMap = function(...args) {
	return flatMap(...args)(this)
}
