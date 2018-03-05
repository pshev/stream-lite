import {proto} from '../../internal/stream'
import {defaultIfEmpty} from '../../operators/defaultIfEmpty'

proto.defaultIfEmpty = function(...args) {
	return defaultIfEmpty(...args)(this)
}
