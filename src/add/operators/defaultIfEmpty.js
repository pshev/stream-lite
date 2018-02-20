import {proto} from '../../core'
import {defaultIfEmpty} from '../../operators/defaultIfEmpty'

proto.defaultIfEmpty = function(...args) {
	return defaultIfEmpty(...args)(this)
}
