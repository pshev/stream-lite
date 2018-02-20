import {proto} from '../../core'
import {map} from '../../operators/map'

proto.map = function(...args) {
	return map(...args)(this)
}
