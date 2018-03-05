import {proto} from '../../internal/stream'
import {combineLatest} from '../../operators/combineLatest'

proto.combineLatest = function(...args) {
	return combineLatest(...args)(this)
}
