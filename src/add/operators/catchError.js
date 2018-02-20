import {proto} from '../../core'
import {catchError} from '../../operators/catchError'

proto.catchError = function(...args) {
	return catchError(...args)(this)
}
