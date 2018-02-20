import {create} from '../core'

export const fromPromise = (promise) => {
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

  return create(producer)
}
