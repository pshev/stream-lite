import {proto} from '../../core'
import {concatMapTo} from '../../operators/concatMapTo'

proto.concatMapTo = function(...args) {
	return concatMapTo(...args)(this)
}
