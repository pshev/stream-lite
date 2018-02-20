import {proto} from '../../core'
import {take} from '../../operators/take'

proto.take = function(...args) {
	return take(...args)(this)
}
