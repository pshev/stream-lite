import {proto} from '../../internal/stream'
import {filter} from '../../operators/filter'

proto.filter = function(...args) {
	return filter(...args)(this)
}
