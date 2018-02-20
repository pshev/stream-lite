import {proto} from '../../core'
import {withLatestFrom} from '../../operators/withLatestFrom'

proto.withLatestFrom = function(...args) {
	return withLatestFrom(...args)(this)
}
