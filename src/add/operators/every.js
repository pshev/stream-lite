import {proto} from '../../internal/stream'
import {every} from '../../operators/every'

proto.every = function(...args) {
	return every(...args)(this)
}
