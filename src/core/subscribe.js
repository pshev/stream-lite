import {notifyUpTheChainOn} from '../internal'
import * as helpers from '../internal/helpers'

export function subscribe(nextOrSubscriber, error, complete) {
	nextOrSubscriber = nextOrSubscriber || (() => {})
  error = error || (err => {throw new Error(err)})
  complete = complete || (() => {})

  const subscriber = typeof nextOrSubscriber === 'function'
    ? {next: nextOrSubscriber, error, complete}
    : nextOrSubscriber

  return function(stream) {
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
}
