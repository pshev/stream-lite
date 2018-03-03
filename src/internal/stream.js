import {proto, baseProps} from '../core/proto'

export function Stream(props, dependency) {
  props.dependencies = dependency ? [dependency] : (props.dependencies || [])

  let stream = Object.assign(Object.create(proto), baseProps(props))

  const nextFn = stream.next
  stream.next = (...args) => stream.nextGuard() && nextFn.call(stream, ...args)

  stream.dependencies.forEach(s => s.dependents.push(stream))

  return stream
}
