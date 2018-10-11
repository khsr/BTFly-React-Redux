
/**
 * Score password from 0 to 100
 * Based on http://stackoverflow.com/questions/948172/password-strength-meter
 *
 * @param {String} pass
 * @return {Number}
 */

export default function scorePassword (pass) {
  if (!pass) return 0
  let score = 0

  // award every unique letter and disable repetitions
  const letters = {}
  for (let i = 0, len = pass.length; i < len; i++) {
    letters[pass[i]] = (letters[pass[i]] || 0) + 1
    score += 5.0 / letters[pass[i]]
  }

  // bonus points for mixing it up
  const variations = {
    digits: /\d/.test(pass),
    lower: /[a-z]/.test(pass),
    upper: /[A-Z]/.test(pass),
    nonWords: /\W/.test(pass)
  }
  const variationCount = Object.keys(variations).filter((c) => variations[c]).length
  score += (variationCount - 1) * 10

  return score > 100 ? 100 : score
}
