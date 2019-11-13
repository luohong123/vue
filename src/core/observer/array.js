/*
 * not type checking this file because flow doesn't play well with
 * (不能输入检查此文件的类型，因为流程不能很好地与)
 * dynamically accessing methods on Array prototype(动态访问数组原型上的方法)
 */

import { def } from '../util/index'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events(拦截变异方法并发出事件)
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method] // 缓存数组原型的方法
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
