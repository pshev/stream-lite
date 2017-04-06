import {traverseUpOnFirstSubscriberAdded, traverseUpOnLastSubscriberRemoved, traverseUpOnStreamCompleted, traverseUpOnStreamError} from './traversals'

const dependenciesMet = stream => stream.dependencies.every(s => s.val !== undefined)

// additional properties dynamically added onto statics and proto
export const statics = {
  create: function(producer = {}, name) {
    producer.start = producer.start || (() => {})
    producer.stop = producer.stop || (() => {})
    return baseCreate({producer}, undefined, name)
  }
}

export const proto = {
  subscribe: function(next, error = err => { throw new Error(err) }, complete = () => {}) {
    return subscribe(this, {next, error, complete})
  },
  next: function(value) { baseNext(this, value) },
  error: function(error) { baseError(this, error) },
  complete: function() { baseComplete(this) },
  nextGuard: function() { return baseNextGuard(this) },
  start: function() {},
  stop: function() {}
}

const baseProps = props => Object.assign({}, {
  active: false,
  dependencies: [],
  dependents: [],
  subscribers: []
}, props)

export function baseCreate(props, dependency, name = 'anonymous') {
  props.dependencies = dependency ? [dependency] : (props.dependencies || [])

  let stream = Object.assign(Object.create(proto), baseProps(props), {name})

  const nextFn = stream.next

  stream.next = function(...args) {
    if (stream.nextGuard()) {
      try {
        nextFn.apply(stream, args)
      } catch (error) {
        stream.error(error)
      }
    }
  }

  stream.dependencies.forEach(s => s.dependents.push(stream))

  return stream
}

export function baseNext(stream, x) {
  stream.val = x
  stream.subscribers.forEach(s => s.next(x))
  stream.dependents.forEach(s => s.next(x))
  return stream
}

export function baseError(stream, error) {
  // we want to call all subscribers' complete callback when
  // all streams that have to be deactivated already have been
  // but we also want to reset stream.subscribers because
  // traverseUpOnStreamError checks that property
  const subscribers = [...stream.subscribers]
  stream.subscribers = []
  // notify up the chain
  traverseUpOnStreamError(stream)
  // notify down the chain
  stream.dependents.forEach(d => d.error(error))
  subscribers.forEach(s => s.error(error))
}

export function baseComplete(stream) {
  // we want to call all subscribers' complete callback when
  // all streams that have to be deactivated already have been
  // but we also want to reset stream.subscribers because
  // traverseUpOnStreamCompleted checks that property
  const subscribers = [...stream.subscribers]
  stream.subscribers = []
  // notify up the chain
  traverseUpOnStreamCompleted(stream)
  // notify down the chain
  stream.dependents.forEach(d => {
    if (d.dependencies.every(dep => !dep.active))
      d.complete()
  })
  subscribers.forEach(s => s.complete())
}

function baseNextGuard(stream) {
  return stream.active === true && dependenciesMet(stream)
}

function subscribe(stream, subscriber) {
  stream.subscribers.push(subscriber)
  if (stream.subscribers.length === 1)
    traverseUpOnFirstSubscriberAdded(stream)
  return { unsubscribe: unsubscribe.bind(null, stream, subscriber) }
}

function unsubscribe(stream, subscriber) {
  if (stream.subscribers === 0) return

  stream.subscribers = stream.subscribers.filter(s => s !== subscriber)

  if (stream.subscribers.length === 0)
    traverseUpOnLastSubscriberRemoved(stream)
}
