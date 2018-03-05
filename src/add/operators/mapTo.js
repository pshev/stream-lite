import {proto} from '../../internal/stream'
import {mapTo} from '../../operators/mapTo'

proto.mapTo = function(...args) {
	return mapTo(...args)(this)
}
