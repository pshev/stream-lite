import {notifyUpTheChainOn} from './upchain-notification'
import {activateStream, deactivateStream, removeSubscriber, isProducerStream, startProducer,
  hasNoSubscribers, hasNoActiveDependencies, hasNoActiveDependents} from './helpers'

// additional properties dynamically added onto statics and proto
export const statics = {
  create(producer = {}, name) {
    producer.start = producer.start || (() => {})
    producer.stop = producer.stop || (() => {})
    return baseCreate({producer}, undefined, name)
  }
}

export const baseNextGuard = s => s.active === true

export const proto = {
  subscribe(next, error = err => { throw new Error(err) }, complete = () => {}) {
    return subscribe(this, {next, error, complete})
  },
  next(value) { baseNext(this, value) },
  error(error) { baseError(this, error) },
  complete() { baseComplete(this) },
  nextGuard() { return baseNextGuard(this) },
  onStart() {},
  onStop() {}
}

const baseProps = props => Object.assign({}, {
  active: false,
  hasEmitted: false,
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
        nextFn.call(stream, ...args)
      } catch (error) {
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

export function baseNext(stream, x) {
  stream.hasEmitted = true
  stream.val = x
  stream.subscribers.forEach(s => s.next(x))
  stream.dependents.forEach(s => s.next(x))
  return stream
}

export function baseError(stream, error) {
  // we want to call all subscribers' complete callback when
  // all streams that have to be deactivated already have been
  // but we also want to reset stream.subscribers because
  // deactivationGuard checks that property
  const subscribers = [...stream.subscribers]
  stream.subscribers = []

  deactivateStream(stream)

  notifyUpTheChainOn(stream, 'error')

  stream.dependents.forEach(d => d.error(error))

  subscribers.forEach(s => s.error(error))
}

export function baseComplete(stream) {
  // we want to call all subscribers' complete callback when
  // all streams that have to be deactivated already have been
  // but we also want to reset stream.subscribers because
  // deactivationGuard checks that property
  const subscribers = [...stream.subscribers]
  stream.subscribers = []

  deactivateStream(stream)

  notifyUpTheChainOn(stream, 'completed')

  stream.dependents
    .filter(hasNoActiveDependencies)
    .forEach(d => d.complete())

  subscribers.forEach(s => s.complete())
}

function subscribe(s, subscriber) {
  s.subscribers.push(subscriber)

  if (s.subscribers.length === 1) {
    activateStream(s)
    isProducerStream(s) && startProducer(s)
    notifyUpTheChainOn(s, 'activated')
  }

  return {unsubscribe: unsubscribe.bind(null, s, subscriber)}
}

function unsubscribe(s, subscriber) {
  if (hasNoSubscribers(s)) return

  removeSubscriber(s, subscriber)

  if (hasNoSubscribers(s)) {
    if (hasNoActiveDependents(s)) {
      deactivateStream(s)
      notifyUpTheChainOn(s, 'completed')
    }
  }
}
