import {proto} from '../../core'
import {mapTo} from '../../operators/mapTo'

proto.mapTo = function(...args) {
	return mapTo(...args)(this)
}
