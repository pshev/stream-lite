import {proto} from '../../internal/stream'
import {concatMap} from '../../operators/concatMap'

proto.concatMap = function(...args) {
	return concatMap(...args)(this)
}
