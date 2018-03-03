import {notifyUpTheChainOn} from '../internal'
import {Subscriber} from './subscriber'
import {activateStream, startStream, deactivateStream, deactivationGuard, hasNoSubscribers, removeSubscriber} from '../internal/helpers'

export const subscribe = (...args) => (stream) => {
  const subscriber = Subscriber(...args)

  stream.subscribers.push(subscriber)

  if (stream.subscribers.length === 1) {
    activateStream(stream)
    startStream(stream)
    notifyUpTheChainOn(stream, 'activated')
  }

  return {
    unsubscribe: function unsubscribe() {
      if (hasNoSubscribers(stream)) return

      removeSubscriber(stream, subscriber)

      if (deactivationGuard(stream)) {
        deactivateStream(stream)
        notifyUpTheChainOn(stream, 'completed')
      }
    }
  }
}
