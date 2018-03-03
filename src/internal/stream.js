import {proto, baseProps} from '../core/proto'
import {baseNextGuard} from '../internal'

export function Stream(props) {
  let stream = Object.assign(Object.create(proto), baseProps(props))

  const nextFn = stream.next
  stream.next = (...args) => baseNextGuard(stream) && nextFn.call(stream, ...args)

  stream.dependencies.forEach(s => s.dependents.push(stream))

  return stream
}
