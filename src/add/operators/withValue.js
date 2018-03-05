import {proto} from '../../internal/stream'
import {withValue} from '../../operators/withValue'

proto.withValue = function(...args) {
	return withValue(...args)(this)
}
