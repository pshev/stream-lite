import {deactivateStream} from './helpers'
import {notifyUpTheChainOnDeactivated} from './upchain-notification'

export function baseError(stream, error) {
  // we want to call all subscribers' complete callback when
  // all streams that have to be deactivated already have been
  // but we also want to reset stream.subscribers because
  // deactivationGuard checks that property
  const subscribers = [...stream.subscribers]

  deactivateStream(stream)

  notifyUpTheChainOnDeactivated(stream)

  stream.dependents.forEach(d => d.error(error))

  subscribers.forEach(s => s.error(error))
}
