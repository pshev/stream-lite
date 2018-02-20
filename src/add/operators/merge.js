import {proto} from '../../core'
import {merge} from '../../operators/merge'

proto.merge = function(...args) {
	return merge(...args)(this)
}
