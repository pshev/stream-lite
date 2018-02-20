import {proto} from '../../core'
import {scan} from '../../operators/scan'

proto.scan = function(...args) {
	return scan(...args)(this)
}
