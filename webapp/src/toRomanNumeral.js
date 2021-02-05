function toRomanNumeral(integer = 0) {
  if (typeof integer === 'number') {
    integer = integer.toString()
  }

  if (integer.includes('.')) {
    let [head, tail = ''] = integer.toString().split('.')

    if (tail.length === 1) {
      tail = `${tail}0`
    }

    integer = head + tail
  }

  integer = Number(integer)

  let romanNumerals = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1
  }

  return Object.entries(romanNumerals).reduce((result, [numeral, value]) => {
    let times = Math.floor(integer / value)
    integer = integer - times * value
    return result + numeral.repeat(times)
  }, '')
}

export default toRomanNumeral
