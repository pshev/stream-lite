import {proto} from '../../core'
import {withValue} from '../../operators/withValue'

proto.withValue = function(...args) {
	return withValue(...args)(this)
}
