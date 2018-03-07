import {fromPromise} from '../statics'

export const toStream = s => s.then ? fromPromise(s) : s
