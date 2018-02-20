import {proto} from '../../core'
import {pairwise} from '../../operators/pairwise'

proto.pairwise = function(...args) {
	return pairwise(...args)(this)
}
