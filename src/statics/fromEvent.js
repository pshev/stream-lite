import {create} from '../core'

export const fromEvent = (element, eventName) => {
  const producer = {
    cb: null,
    start(consumer) {
      this.cb = consumer.next
      element.addEventListener(eventName, this.cb)
    },
    stop() {
      element.removeEventListener(eventName, this.cb)
      this.cb = null
    }
  }
  return create(producer)
}
