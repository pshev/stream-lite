import {activateStream, startProducer, isActive, isInactive, isProducerStream, deactivateStream, deactivationGuard} from './helpers'
import {traverseUp} from './traversals'

const onActivated = stream => {
  let producerStreams = []

  traverseUp(stream, {
    predicate: isInactive,
    action: s => {
      activateStream(s)
      isProducerStream(s) && producerStreams.push(s) //why not call start inline? see below.
    }
  })

  producerStreams.forEach(startProducer)
}

const onError = stream => traverseUp(stream, {
  predicate: isActive,
  action: deactivateStream
})

const onCompleted = stream => traverseUp(stream, {
  predicate: isActive,
  action: deactivateStream,
  actionGuard: deactivationGuard
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
// If we can producer.start inline we'd have:
// of(1) calls next on merge with 1
// of(1) completes and conditionally calls .complete() on all it's dependents
// the condition being d.dependencies.every(dep => !dep.active)
// of(2) however hasn't yet had it's active flag set to true so condition passes
// as a result merge stream completes and doesn't emit 2
