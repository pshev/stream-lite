import {notifyUpTheChainOn} from '../internal'
import {Subscriber} from './subscriber'
import * as helpers from '../internal/helpers'

export const subscribe = (...args) => (stream) => {
  const subscriber = Subscriber(...args)

  stream.subscribers.push(subscriber)

  if (stream.subscribers.length === 1) {
    helpers.activateStream(stream)
    helpers.isProducerStream(stream) && helpers.startProducer(stream)
    notifyUpTheChainOn(stream, 'activated')
  }

  return {
    unsubscribe: function unsubscribe() {
      if (helpers.hasNoSubscribers(stream)) return

      helpers.removeSubscriber(stream, subscriber)

      if (helpers.hasNoSubscribers(stream)) {
        if (helpers.hasNoActiveDependents(stream)) {
          helpers.deactivateStream(stream)
          notifyUpTheChainOn(stream, 'completed')
        }
      }
    }
  }
}
