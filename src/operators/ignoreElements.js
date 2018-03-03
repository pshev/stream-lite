import {Stream} from '../internal'

export const ignoreElements = () => stream =>
  Stream({next: () => {}}, stream)
