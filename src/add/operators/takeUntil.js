import {proto} from '../../internal/stream'
import {takeUntil} from '../../operators/takeUntil'

proto.takeUntil = function(...args) {
	return takeUntil(...args)(this)
}
