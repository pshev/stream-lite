import {proto} from '../../core'

proto.toPromise = function toPromise() {
  return new Promise((resolve, reject) => {
    let value
    this.subscribe(x => value = x, err => reject(err), () => resolve(value))
  })
}
