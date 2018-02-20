import {proto} from '../../core'
import {last} from '../../operators/last'

proto.last = function(...args) {
	return last(...args)(this)
}
