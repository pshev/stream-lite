import {statics, baseCreate} from '../../core'

statics.fromPromise = function fromPromise(promise) {
  const producer = {
    cancelled: false,
    start: function(self) {
      if (!promise.then) {
        self.next(promise)
        self.complete()
        return
      }

      promise
        .then(x => {
          if(!this.cancelled) {
            self.next(x)
            self.complete()
          }
        },
        error => {
          if(!this.cancelled)
            self.error(error)
        })
    },
    stop: function() {
      this.cancelled = true
    }
  }

  return baseCreate({
    producer,
    streamActivated: function() {
      this.producer.cancelled = false
    }
  }, undefined, 'fromPromise')
}
