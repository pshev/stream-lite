import {baseCreate, baseNext, proto, statics} from '../../core'

const combine = (...streams) => baseCreate({
  dependencies: streams,
  next: function() {
    baseNext(this, this.dependencies.map(d => d.val))
  }
})

statics.combine = combine
statics.combineLatest = combine

proto.combine = function(...streams) {
  return statics.combine(this, ...streams)
}

proto.combineLatest = proto.combine
