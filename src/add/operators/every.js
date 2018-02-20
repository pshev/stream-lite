import {proto} from '../../core'
import {every} from '../../operators/every'

proto.every = function(...args) {
	return every(...args)(this)
}
