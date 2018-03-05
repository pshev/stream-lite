import {proto} from '../../internal/stream'
import {withLatestFrom} from '../../operators/withLatestFrom'

proto.withLatestFrom = function(...args) {
	return withLatestFrom(...args)(this)
}
