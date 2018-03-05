import {proto} from '../../internal/stream'
import {switchMap} from '../../operators/switchMap'

proto.switchMap = function(...args) {
	return switchMap(...args)(this)
}
