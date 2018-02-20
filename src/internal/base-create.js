import {proto, baseProps} from '../core/proto'

export function baseCreate(props, dependency) {
  props.dependencies = dependency
    ? [dependency]
    : (props.dependencies || [])

  let stream = Object.assign(Object.create(proto), baseProps(props))

  const nextFn = stream.next

  stream.next = function(...args) {
    if (stream.nextGuard()) {
      try {
        nextFn.call(stream, ...args)
      } catch (error) {
        //TODO: Write tests for this logic
        if (stream.active)
          stream.error(error)
        else
          throw error
      }
    }
  }

  stream.dependencies.forEach(s => s.dependents.push(stream))

  return stream
}
