import {proto} from '../../core'
import {debounceTime} from '../../operators/debounceTime'

proto.debounceTime = function(...args) {
	return debounceTime(...args)(this)
}
