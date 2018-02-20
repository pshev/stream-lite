import {baseCreate, baseNextGuard, baseNext} from '../internal'

export const combine = (...streams) => baseCreate({
  dependencies: streams,
  next() {
    baseNext(this, this.dependencies.map(d => d.val))
  },
  nextGuard() {
    return baseNextGuard(this) && this.dependencies.every(s => s.hasEmitted === true)
  }
})

