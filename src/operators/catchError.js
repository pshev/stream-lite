import {Stream, baseError} from '../internal'
import {_try, ERROR} from '../util/try'

export const catchError = fn => stream =>
  Stream({
    error(error) {
      const inner = _try(this, () => fn(error))
      if (inner === ERROR) return

      inner.subscribe(
        this.next.bind(this),
        baseError.bind(null, this),
        this.complete.bind(this)
      )
    },
    dependencies: [stream]
  })
