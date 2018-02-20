import {proto} from '../../core'
import {concatMap} from '../../operators/concatMap'

proto.concatMap = function(...args) {
	return concatMap(...args)(this)
}
