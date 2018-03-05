import {proto} from '../../internal/stream'
import {pluck} from '../../operators/pluck'

proto.pluck = function(...args) {
	return pluck(...args)(this)
}
