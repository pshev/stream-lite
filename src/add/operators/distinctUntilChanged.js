import {proto} from '../../internal/stream'
import {distinctUntilChanged} from '../../operators/distinctUntilChanged'

proto.distinctUntilChanged = function(...args) {
	return distinctUntilChanged(...args)(this)
}
