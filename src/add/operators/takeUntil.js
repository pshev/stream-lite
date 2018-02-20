import {proto} from '../../core'
import {takeUntil} from '../../operators/takeUntil'

proto.takeUntil = function(...args) {
	return takeUntil(...args)(this)
}
