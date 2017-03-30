import './create'
import statics from '../../core/statics'

statics.fromPromise = function fromPromise(promise) {
  let cancelled = false

  const producer = {
    start: function(self) {
      promise
        .then(x => {
          if(!cancelled) {
            self.next(x)
            self.complete()
          }
        })
        .catch(error => {
          if(!cancelled)
            self.error(error)
        })
    },
    stop: function() {
      cancelled = true
    }
  }

  return statics.create(producer, 'fromPromise')
}
