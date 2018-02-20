import {proto} from '../../core'
import {flatMap} from '../../operators/flatMap'

proto.flatMap = function(...args) {
	return flatMap(...args)(this)
}
