import {proto} from '../../internal/stream'
import {merge} from '../../operators/merge'

proto.merge = function(...args) {
	return merge(...args)(this)
}
