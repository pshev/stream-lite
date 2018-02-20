import {proto} from '../../core'
import {filter} from '../../operators/filter'

proto.filter = function(...args) {
	return filter(...args)(this)
}
