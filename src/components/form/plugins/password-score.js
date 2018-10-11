import domify from 'domify'
import passwordForm from './password'
import scorePassword from '../../../utils/score-password'

/**
 * Password score plugin.
 */

export default function passwordScore (selector, opts) {
  return (form) => {
    const password = passwordForm(selector, opts)(form)

    const $label = password.$el.parentElement.querySelector('label')
    $label.appendChild(domify(`
      <div class="form-password-strength u-hide js-password-strength">
        Strength
        <span class="form-password-strength__meter">
          <span class="js-password-strength-meter-line"></span>
        </span>
      </div>
    `))
    const $passwordStrength = $label.querySelector('.js-password-strength')
    const $passwordStrengthMeterLine = $label.querySelector('.js-password-strength-meter-line')

    /**
     * Handle password's strength.
     */

    password.$el.addEventListener('input', () => {
      const score = scorePassword(password.getValue())
      if (score === 0) {
        password.setState()
        $passwordStrength.classList.add('u-hide')
      } else if (score < 30) {
        password.setState({ isInvalid: true })
        setScore(score)
      } else {
        password.setState({ isValid: true })
        setScore(score)
      }
    })

    return password

    function setScore (score) {
      $passwordStrength.classList.remove('u-hide')
      const color = score < 30 ? 'F45D6F' : (score < 60 ? 'FFA76C' : '34EA7E')
      $passwordStrengthMeterLine.style.width = score * 1.3 > 100 ? 100 : score * 1.3 + '%'
      $passwordStrengthMeterLine.style.backgroundColor = '#' + color
    }
  }
}
