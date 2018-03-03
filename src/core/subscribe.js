import {Subscriber} from '../internal'
import {notifyUpTheChainOnActivated, notifyUpTheChainOnDeactivated} from '../internal/upchain-notification'
import {activateStream, startStream, deactivateStream, deactivationGuard, hasNoSubscribers, removeSubscriber} from '../internal/helpers'

export const subscribe = (...args) => (stream) => {
  const subscriber = Subscriber(...args)

  stream.subscribers.push(subscriber)

  if (stream.subscribers.length === 1) {
    activateStream(stream)
    startStream(stream)
    notifyUpTheChainOnActivated(stream)
  }

  return {
    unsubscribe() {
      if (hasNoSubscribers(stream)) return

      removeSubscriber(stream, subscriber)

      if (deactivationGuard(stream)) {
        deactivateStream(stream)
        notifyUpTheChainOnDeactivated(stream)
      }
    }
  }
}
