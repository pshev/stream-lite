import $$observable from 'symbol-observable'
import {pipe} from '../util/pipe'
import {subscribe} from '../core/subscribe'
import {isActive} from './helpers'
import {baseNext, baseError, baseComplete} from './'

// Although it is not the recommended way
// methods may be added onto proto with
// import 'stream-lite/add/operators/X'
export let proto = {
  subscribe(...args) { return subscribe(...args)(this) },
  next(value) { baseNext(this, value) },
  error(error) { baseError(this, error) },
  complete() { baseComplete(this) },
  pipe(...args) { return pipe(...args)(this) },
  onStart() {},
  onStop() {},
  getValue() { return this.val },
  [$$observable]() { return this }
}

export function Stream(props) {
  let stream = Object.assign(Object.create(proto), {
    active: false,
    hasEmitted: false,
    dependencies: [],
    dependents: [],
    subscribers: []
  }, props)

  const nextFn = stream.next
  stream.next = (...args) => isActive(stream) && nextFn.call(stream, ...args)

  stream.dependencies.forEach(s => s.dependents.push(stream))

  return stream
}
