import {proto} from '../../internal/stream'
import {debounce} from '../../operators/debounce'

proto.debounce = function(...args) {
	return debounce(...args)(this)
}
