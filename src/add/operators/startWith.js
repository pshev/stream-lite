import {proto} from '../../core'
import {startWith} from '../../operators/startWith'

proto.startWith = function(...args) {
	return startWith(...args)(this)
}
