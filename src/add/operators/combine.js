import {proto} from '../../core'
import {combine} from '../../operators/combine'

proto.combine = function(...args) {
	return combine(...args)(this)
}
