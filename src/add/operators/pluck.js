import {proto} from '../../core'
import {pluck} from '../../operators/pluck'

proto.pluck = function(...args) {
	return pluck(...args)(this)
}
