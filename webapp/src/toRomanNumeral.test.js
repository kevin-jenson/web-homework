import toRomanNumeral from './toRomanNumeral'

describe('toRomanNumeral.js', () => {
  test('23535 = MMMMMMMMMMMMMMMMMMMMMMMDXXXV', () => {
    expect(toRomanNumeral(23535)).toEqual('MMMMMMMMMMMMMMMMMMMMMMMDXXXV')
  })

  test('34 = XXXIV', () => {
    expect(toRomanNumeral(34)).toEqual('XXXIV')
  })

  test('10 = X', () => {
    expect(toRomanNumeral(10)).toEqual('X')
  })

  test('5 = V', () => {
    expect(toRomanNumeral(5)).toEqual('V')
  })

  test('99999 = MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMCMXCIX', () => {
    expect(toRomanNumeral(99999)).toEqual(
      'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMCMXCIX'
    )
  })

  test('345 = CCCXLV', () => {
    expect(toRomanNumeral(345)).toEqual('CCCXLV')
  })
})
