import {create} from '../core'

export const fromEvent = (element, eventName) => {
  const producer = {
    cb: null,
    start(self) {
      this.cb = self.next
      element.addEventListener(eventName, this.cb)
    },
    stop() {
      element.removeEventListener(eventName, this.cb)
      this.cb = null
    }
  }
  return create(producer)
}
