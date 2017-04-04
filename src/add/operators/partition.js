import './filter'
import {proto} from '../../core'

proto.partition = function partition(predicate) {
  return [
    this.filter(predicate),
    this.filter(x => !predicate(x))
  ]
}