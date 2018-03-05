import {proto} from '../../internal/stream'
import {concatMapTo} from '../../operators/concatMapTo'

proto.concatMapTo = function(...args) {
	return concatMapTo(...args)(this)
}
