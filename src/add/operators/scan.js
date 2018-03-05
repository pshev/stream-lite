import {proto} from '../../internal/stream'
import {scan} from '../../operators/scan'

proto.scan = function(...args) {
	return scan(...args)(this)
}
