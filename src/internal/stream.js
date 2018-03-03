import {proto, baseProps} from '../core/proto'
import {isActive} from './helpers'

export function Stream(props) {
  let stream = Object.assign(Object.create(proto), baseProps(props))

  const nextFn = stream.next
  stream.next = (...args) => isActive(stream) && nextFn.call(stream, ...args)

  stream.dependencies.forEach(s => s.dependents.push(stream))

  return stream
}
