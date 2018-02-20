import {proto} from '../../core'
import {switchMap} from '../../operators/switchMap'

proto.switchMap = function(...args) {
	return switchMap(...args)(this)
}
