import { bind as delegate } from 'delegate-events'
import sendButton from '../../components/send-button'
import { apiHost, bootstrap } from '../../components/boot'
import resizeTextarea from '../../utils/resize-textarea'
import t from '../../utils/locales'
import './index.css'

// locals

const { managerName, questionId, token } = bootstrap

// cache dom objects

const $body = document.querySelector('.js-body')
const $form = $body.querySelector('.js-form')
const $reply = $form.querySelector('.js-reply')
const $smileys = $form.querySelectorAll('.js-smileys')
const $rating = $form.querySelectorAll('.js-rating')
const $yesno = $form.querySelectorAll('.js-yesno')
const $button = $form.querySelector('.js-button')

// setup `states` to enable/disabled send button

const states = {}
if ($smileys) setInitialState($smileys, '.js-smiley')
if ($rating) setInitialState($rating, '.js-rating-item', { isRating: true })
if ($yesno) setInitialState($yesno, '.js-yesno-item')

function setInitialState ($els, className, { isRating } = {}) {
  void [].forEach.call($els, ($el) => {
    const stateName = $el.getAttribute('data-index')
    const $textarea = $el.querySelector('.js-textarea')
    states[stateName] = false

    if ($textarea) {
      resizeTextarea($textarea, { size: '2rem' })
    }

    pollToggler($el, className, stateName, isRating, () => {
      if (!$textarea) return
      $textarea.classList.remove('is-hide')
      $textarea.focus()
    })
  })
}

function toggleState (key, val) {
  states[key] = val
  if (Object.keys(states).every((stateKey) => states[stateKey])) {
    $button.removeAttribute('disabled')
  } else {
    $button.setAttribute('disabled', true)
  }
}

// setup event listeners

if ($reply) {
  resizeTextarea($reply, { size: '2rem' })
  if (!Object.keys(states).length) {
    $reply.addEventListener('input', () => {
      if ($reply.value.trim()) {
        $button.removeAttribute('disabled')
      } else {
        $button.setAttribute('disabled', true)
      }
    })
  }
}

$form.addEventListener('submit', onSubmit)
$button.addEventListener('click', onSubmit)

function onSubmit (e) {
  e.preventDefault()
  if ($button.hasAttribute('disabled')) return

  const stopSpinner = sendButton($button, { isDarkGreen: !bootstrap.display.includes('anonymous') })
  let attrs
  if (bootstrap.type !== 'polls') {
    attrs = {
      body: $reply
        ? $reply.value.trim()
        : null,
      smileys: $smileys.length
        ? parseInt($form.querySelector('.js-smiley.is-selected').getAttribute('data-value'), 10)
        : null,
      rating: $rating.length
        ? parseInt($form.querySelector('.js-rating-item.is-selected').getAttribute('data-value'), 10)
        : null,
      yesno: $yesno.length
        ? $form.querySelector('.js-yesno-item.is-selected').getAttribute('data-value') === 'true'
        : null
    }
  } else {
    attrs = {
      body: $reply
        ? $reply.value.trim()
        : null,
      polls: bootstrap.polls.map(({ type }, index) => {
        const $els = $form.querySelector(`[data-index="${type}${index}"]`)
        const value = $els.querySelector('.is-selected').getAttribute('data-value')
        const $textarea = $els.querySelector('.js-textarea')
        return {
          smileys: type === 'smileys' ? parseInt(value, 10) : null,
          rating: type === 'rating' ? parseInt(value, 10) : null,
          yesno: type === 'yesno' ? value === 'true' : null,
          body: $textarea ? $textarea.value : ''
        }
      })
    }
  }
  return fetch(`${apiHost}/api/questions/${questionId}/replies`, {
    method: 'post',
    body: JSON.stringify(attrs),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then((res) => {
    if (res.status !== 201) {
      window.alert('Sorry, unexpeted error.')
    } else {
      stopSpinner()
      $body.innerHTML = thanksTemplate()
    }
  })
}

/**
 * Initialize poll option.
 *
 * @param {Element} $el
 * @param {String} className
 * @param {String} stateName
 * @param {Boolean} isRating
 * @param {Function} cb
 */

function pollToggler ($el, className, stateName, isRating, cb) {
  const $items = [].slice.call($el.querySelectorAll(className))
  let selected
  let timeout
  delegate($el, className, 'click', (e) => {
    if (selected) {
      selected.classList.remove('is-selected')
    } else {
      $items.forEach(($item) => $item.classList.remove('is-empty'))
    }
    selected = e.delegateTarget
    selected.classList.add('is-selected')
    if (!states[stateName]) toggleState(stateName, true)
    cb(e)
  })
  delegate($el, className, 'mouseover', () => {
    if (stateName === 'rating' && selected) selected.classList.remove('is-selected')
    if (selected) {
      if (isRating) selected.classList.remove('is-selected')
      return
    }
    if (timeout) clearTimeout(timeout)
    $items.forEach(($item) => $item.classList.remove('is-empty'))
  })
  delegate($el, className, 'mouseout', () => {
    if (stateName === 'rating' && selected) selected.classList.add('is-selected')
    if (selected) {
      if (isRating) selected.classList.add('is-selected')
      return
    }
    if (timeout) clearTimeout(timeout) // use timeout to avoid blinks on mousemove
    timeout = setTimeout(() => {
      $items.forEach(($item) => $item.classList.add('is-empty'))
    }, 50)
  })
}

function thanksTemplate () {
  return `
    <h4 class="question-body__subtitle">${t('question.client.thanks')}</h4>
    <p class="question-body__text question-body__text--bold">
      ${t('question.client.thanks-message')}
      <br>
    </p>
    <p class="question-body__text">
      ${t('question.client.thanks-notify', { managerName })}
    </p>
    <p class="question-body__text">
      ${t('question.client.thanks-bye')}
    </p>
  `
}
