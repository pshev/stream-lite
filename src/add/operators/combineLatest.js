import {proto} from '../../core'
import {combineLatest} from '../../operators/combineLatest'

proto.combineLatest = function(...args) {
	return combineLatest(...args)(this)
}
