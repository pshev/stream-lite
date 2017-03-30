import proto from './proto'

const baseStreamProps = props => Object.assign({}, {
  shouldEmit: false,
  dependencies: [],
  dependents: [],
  subscribers: []
}, props)

export function baseCreate(props, dependency, name = 'anonymous') {
  props.dependencies = dependency ? [dependency] : (props.dependencies || [])

  let stream = Object.assign(Object.create(proto), baseStreamProps(props), {name})

  const nextFn = stream.next

  stream.next = function(...args) {
    if (!stream.baseNextGuard()) return

    try {
      nextFn.apply(stream, args)
    } catch (error) {
      stream.error(error)
    }
  }

  stream.dependencies.forEach(s => s.dependents.push(stream))

  return stream
}
