import {proto} from '../../internal/stream'
import {partition} from '../../operators/partition'

proto.partition = function(...args) {
	return partition(...args)(this)
}
