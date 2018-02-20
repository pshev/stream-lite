import {baseCreate, baseError} from '../internal'

export const catchError = fn => stream =>
  baseCreate({
    error(error) {
      const nestedStream = fn(error)

      nestedStream.subscribe(
        this.next.bind(this),
        baseError.bind(null, this),
        this.complete.bind(this)
      )
    }
  }, stream)
