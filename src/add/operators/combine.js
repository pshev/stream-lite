import {proto} from '../../internal/stream'
import {combine} from '../../operators/combine'

proto.combine = function(...args) {
	return combine(...args)(this)
}
