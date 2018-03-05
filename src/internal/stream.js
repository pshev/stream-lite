import {proto} from '../core/proto'
import {isActive} from './helpers'

export function Stream(props) {
  let stream = Object.assign(Object.create(proto), {
    active: false,
    hasEmitted: false,
    dependencies: [],
    dependents: [],
    subscribers: []
  }, props)

  const nextFn = stream.next
  stream.next = (...args) => isActive(stream) && nextFn.call(stream, ...args)

  stream.dependencies.forEach(s => s.dependents.push(stream))

  return stream
}
