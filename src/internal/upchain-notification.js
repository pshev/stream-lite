import {traverseUp} from './traversals'
import {activateStream, startStream, deactivateStream, deactivationGuard, isActive, isInactive} from './helpers'

export const notifyUpTheChainOnActivated = stream => {
  let toStart = []

  traverseUp(stream, {
    predicate: isInactive,
    action: s => {
      activateStream(s)
      toStart.push(s) //why not start inline? see below.
    }
  })

  toStart.forEach(startStream)
}

export const notifyUpTheChainOnDeactivated = stream => traverseUp(stream, {
  predicate: isActive,
  action: deactivateStream,
  actionGuard: deactivationGuard
})

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
