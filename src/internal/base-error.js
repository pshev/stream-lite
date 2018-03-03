import {deactivateStream} from './helpers'
import {notifyUpTheChainOn} from './upchain-notification'

export function baseError(stream, error) {
  // we want to call all subscribers' complete callback when
  // all streams that have to be deactivated already have been
  // but we also want to reset stream.subscribers because
  // deactivationGuard checks that property
  const subscribers = [...stream.subscribers]

  deactivateStream(stream)

  notifyUpTheChainOn(stream, 'error')

  stream.dependents.forEach(d => d.error(error))

  subscribers.forEach(s => s.error(error))
}
