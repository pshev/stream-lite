import {baseCreate, baseNextGuard, baseNext, proto, statics} from '../../core'

const combine = (...streams) => baseCreate({
  dependencies: streams,
  next() {
    baseNext(this, this.dependencies.map(d => d.val))
  },
  nextGuard() {
    return baseNextGuard(this) && this.dependencies.every(s => s.hasEmitted === true)
  }
}, null, 'combine')

statics.combine = combine
statics.combineLatest = combine

proto.combine = function(...streams) {
  return statics.combine(this, ...streams)
}

proto.combineLatest = proto.combine
