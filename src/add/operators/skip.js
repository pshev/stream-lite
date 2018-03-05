import {proto} from '../../internal/stream'
import {skip} from '../../operators/skip'

proto.skip = function(...args) {
	return skip(...args)(this)
}
