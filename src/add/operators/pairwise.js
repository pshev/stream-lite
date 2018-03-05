import {proto} from '../../internal/stream'
import {pairwise} from '../../operators/pairwise'

proto.pairwise = function(...args) {
	return pairwise(...args)(this)
}
