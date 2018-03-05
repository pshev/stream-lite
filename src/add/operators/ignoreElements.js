import {proto} from '../../internal/stream'
import {ignoreElements} from '../../operators/ignoreElements'

proto.ignoreElements = function(...args) {
	return ignoreElements(...args)(this)
}
