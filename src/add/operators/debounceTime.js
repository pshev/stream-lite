import {proto} from '../../internal/stream'
import {debounceTime} from '../../operators/debounceTime'

proto.debounceTime = function(...args) {
	return debounceTime(...args)(this)
}
