import {proto} from '../../internal/stream'
import {startWith} from '../../operators/startWith'

proto.startWith = function(...args) {
	return startWith(...args)(this)
}
