import './create'
import statics from '../../statics'

statics.fromPromise = function fromPromise(promise) {
  let cancelled = false

  const producer = {
    start: function (consumer) {
      promise
        .then(x => {
          if (!cancelled)
            consumer.next(x)
        })
        .catch(error => {
          if (!cancelled)
            consumer.error(error)
        })
    },
    stop: function () {
      cancelled = true
    }
  }

  return statics.create(producer, 'fromPromise')
}
