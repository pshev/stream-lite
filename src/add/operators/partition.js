import {proto} from '../../core'
import {partition} from '../../operators/partition'

proto.partition = function(...args) {
	return partition(...args)(this)
}
