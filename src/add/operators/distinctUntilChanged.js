import {proto} from '../../core'
import {distinctUntilChanged} from '../../operators/distinctUntilChanged'

proto.distinctUntilChanged = function(...args) {
	return distinctUntilChanged(...args)(this)
}
