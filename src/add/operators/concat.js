import {proto} from '../../core'
import {concat} from '../../operators/concat'

proto.concat = function(...args) {
	return concat(...args)(this)
}
