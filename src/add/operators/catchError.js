import {proto} from '../../internal/stream'
import {catchError} from '../../operators/catchError'

proto.catchError = function(...args) {
	return catchError(...args)(this)
}
