import {baseNext, baseCreate} from '../internal'

export const startWith = (...xs) => stream =>
  baseCreate({
    onStart() {
      xs.forEach(x => baseNext(this, x))
    }
  }, stream)
