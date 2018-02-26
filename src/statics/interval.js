import {create} from '../core'

export const interval = step => {
  const producer = {
    counter: 0,
    id: 0,
    start(self) {
      this.id = setInterval(() => self.next(this.counter++), step)
    },
    stop() {
      clearInterval(this.id)
      this.id = 0
      this.counter = 0
    }
  }

  return create(producer)
}
