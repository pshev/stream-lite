import {statics} from '../../core'

statics.fromPromise = function fromPromise(promise) {
  const producer = {
    cancelled: false,
    start(self) {
      this.cancelled = false

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
    onStop() {
      this.cancelled = true
    }
  }

  return statics.create(producer, 'fromPromise')
}
