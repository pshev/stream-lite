import {Stream, baseNext} from '../internal'

export const combine = (...streams) => Stream({
  dependencies: streams,
  next() {
    if (this.dependencies.every(s => s.hasEmitted === true))
      baseNext(this, this.dependencies.map(d => d.val))
  }
})

