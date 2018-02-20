import {proto} from '../../core'
import {first} from '../../operators/first'

proto.first = function(...args) {
	return first(...args)(this)
}
