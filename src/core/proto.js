import $$observable from 'symbol-observable'
import {baseNext, baseError, baseComplete} from '../internal'
import {pipe} from '../util/pipe'
import {subscribe} from './subscribe'

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

export const baseProps = props => Object.assign({}, {
  active: false,
  hasEmitted: false,
  dependencies: [],
  dependents: [],
  subscribers: []
}, props)
