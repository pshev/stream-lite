import {notifyUpTheChainOn} from './upchain-notification'
import {deactivateStream, hasNoActiveDependencies} from './helpers'

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
