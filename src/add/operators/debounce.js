import {proto} from '../../core'
import {debounce} from '../../operators/debounce'

proto.debounce = function(...args) {
	return debounce(...args)(this)
}
