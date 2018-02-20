import {proto} from '../../core'
import {single} from '../../operators/single'

proto.single = function(...args) {
	return single(...args)(this)
}
