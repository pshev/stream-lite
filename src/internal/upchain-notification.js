import * as helpers from './helpers'
import {traverseUp} from './traversals'

const onActivated = stream => {
  let toStart = []

  traverseUp(stream, {
    predicate: helpers.isInactive,
    action: s => {
      helpers.activateStream(s)
      toStart.push(s) //why not start inline? see below.
    }
  })

  toStart.forEach(helpers.startStream)
}

const onError = stream => traverseUp(stream, {
  predicate: helpers.isActive,
  action: helpers.deactivateStream
})

const onCompleted = stream => traverseUp(stream, {
  predicate: helpers.isActive,
  action: helpers.deactivateStream,
  actionGuard: helpers.deactivationGuard
})

const eventHandlers = {
  activated: onActivated,
  completed: onCompleted,
  error: onError
}

export const notifyUpTheChainOn = (stream, eventType) =>
  eventHandlers[eventType](stream)


// why not call s.producer.start right inline?
// if we have something like this:
// Stream.merge(Stream.of(1), Stream.of(2)).subscribe(..)
// we want to first mark both 'of' streams as active
// and only then let them start producing values
// If we call producer.start inline we'd have:
// of(1) calls next on merge with 1
// of(1) completes and conditionally calls .complete() on all it's dependents
// the condition being d.dependencies.every(dep => !dep.active)
// of(2) however hasn't yet had it's active flag set to true so condition passes
// as a result merge stream completes and doesn't emit 2
