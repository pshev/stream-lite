import {baseNext, Stream} from '../internal'

export const startWith = (...xs) => stream =>
  Stream({
    onStart() {
      xs.forEach(x => baseNext(this, x))
    },
    dependencies: [stream]
  })
