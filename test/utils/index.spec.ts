import { isPlainObject, deepMerge } from '../../src/utils'

describe('utils', () => {
  describe('isPlainObject', () => {
    test('should valid PlainObject', () => {
      expect(isPlainObject({})).toBeTruthy
      expect(isPlainObject(new Date())).toBeFalsy
    })
  })
  describe('deepMerge', () => {
    test('should be immutable', () => {
      const a = Object.create(null)
      const b:any = {foo: 123}
      const c:any = {bar: 456}
      deepMerge(a, b, c)
      expect(typeof a.foo).toBe('undefined')
      expect(typeof a.bar).toBe('undefined')
      expect(typeof b.bar).toBe('undefined')
      expect(typeof c.foo).toBe('undefined')
    })
    test('should deepMerge properties', () => {
      const a = {foo: 123}
      const b = {bar: 456}
      const c = {foo: 789}
      const d = deepMerge(a, b, c)
      expect(d.foo).toBe(789)
      expect(d.bar).toBe(456)
    })
    test('should deepMerge recursively', () => {
      const a = { foo: { bar: 123 } }
      const b = { foo: { baz: 456 }, bar: { qux: 789 } }
      const c = deepMerge(a, b)
      expect(c).toEqual({
        foo: {
          bar: 123,
          baz: 456
        },
        bar: {
          qux: 789
        }
      })
    })
    test('should remove all references from nested objects', () => {
      const a = {foo: {bar: 123}}
      const b = {}
      const c = deepMerge(a, b)
      expect(c).toEqual({
        foo: {
          bar: 123
        }
      })
      expect(c.foo).not.toBe(a.foo)
    })
    test('should handle null & undefined argumnets', () => {
      expect(deepMerge(undefined, undefined)).toEqual({})
      expect(deepMerge(undefined, {foo: 123})).toEqual({foo: 123})
      expect(deepMerge({foo: 123, undefined})).toEqual({foo: 123})

      expect(deepMerge(null, null)).toEqual({})
      expect(deepMerge(null, {foo: 123})).toEqual({foo: 123})
      expect(deepMerge({foo: 123}, null)).toEqual({foo: 123})
    })
  })
})