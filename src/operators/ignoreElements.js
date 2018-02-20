import {baseCreate} from '../internal'

export const ignoreElements = () => stream =>
  baseCreate({next: () => {}}, stream)
