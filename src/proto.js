import {traverseUpOnFirstSubscriberAdded, traverseUpOnLastSubscriberRemoved, traverseUpOnStreamCompleted, traverseUpOnStreamError} from './traversals'

const dependenciesMet = stream => stream.dependencies.every(s => s.val !== undefined)

function subscribe(stream, subscriber) {
  stream.subscribers.push(subscriber)
  if (stream.subscribers.length === 1)
    traverseUpOnFirstSubscriberAdded(stream)
  return { unsubscribe: unsubscribe.bind(null, stream, subscriber) }
}

function unsubscribe(stream, subscriber) {
  stream.subscribers = stream.subscribers.filter(s => s !== subscriber)

  if (stream.subscribers.length === 0)
    traverseUpOnLastSubscriberRemoved(stream)
}

export function defaultOnNext(stream, x) {
  stream.val = x
  stream.subscribers.forEach(s => s.next(x))
  stream.dependents.forEach(s => s.next(x))
  return stream
}

export function defaultOnError(stream, error) {
  stream.subscribers.forEach(s => s.error(error))
  stream.subscribers = []
  traverseUpOnStreamError(stream)
  stream.dependents.forEach(d => d.error(error))
}

export function defaultOnComplete(stream) {
  stream.subscribers.forEach(s => s.complete())
  stream.subscribers = []
  traverseUpOnStreamCompleted(stream)
  stream.dependents.forEach(d => {
    if (d.dependencies.every(dep => !dep.shouldEmit))
      d.complete()
  })
}

export default {
  subscribe: function(next, error = err => { throw new Error(err) }, complete = () => {}) {
    return subscribe(this, {next, error, complete})
  },
  next: function(value) {
    defaultOnNext(this, value)
  },
  error: function(error) {
    defaultOnError(this, error)
  },
  complete: function() {
    defaultOnComplete(this)
  },
  streamActivated: function() {},
  baseNextGuard: function() {
    return this.shouldEmit === true && dependenciesMet(this)
  }
}
