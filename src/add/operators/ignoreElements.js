import {proto} from '../../core'
import {ignoreElements} from '../../operators/ignoreElements'

proto.ignoreElements = function(...args) {
	return ignoreElements(...args)(this)
}
