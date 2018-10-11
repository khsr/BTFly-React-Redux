import { bind as delegate } from 'delegate-events'
import domify from 'domify'
import resizeTextarea from '../../utils/resize-textarea'
import { requestApi, onResponseError } from '../../utils/request'
import sendButton from '../../components/send-button'
import { bootstrap } from '../../components/boot'
import t from '../../utils/locales'
import './index.css'

const { questionId, token, isDemo } = bootstrap
let mood = bootstrap.mood
let replyId = bootstrap.replyId
let forceUpdateMood = false
const arrProto = Array.prototype
const states = {}
const comments = {}
const $body = document.querySelector('.js-body')
const $moodValue = $body.querySelector('.js-moodValue')
const $form = $body.querySelector('.js-form')
const $reply = $form.querySelector('.js-reply')
const $button = $form.querySelector('.js-button')
const $moodName = $form.querySelector('.js-moodName')

// setup form

resizeTextarea($reply, { size: '2rem' })
setupMoodChanger()
arrProto.forEach.call($form.querySelectorAll('.js-poll'), setupPoll)

$form.addEventListener('submit', onSubmit)
$button.addEventListener('click', onSubmit)

// send reply with JS

if (replyId) {
  updateReply()
} else {
  createReply().then(({ _id }) => {
    replyId = _id
    if (forceUpdateMood) updateReply()
  })
}

/**
 * Submit form.
 */

function onSubmit (e) {
  e.preventDefault()
  if ($button.hasAttribute('disabled')) return
  const stopSpinner = sendButton($button)
  const body = { mood, moodDetails: states, moodComments: comments, body: $reply.value.trim() }

  if (isDemo) {
    console.log(JSON.stringify(body, null, '  ')) // eslint-disable-line no-console
    $body.innerHTML = thanksTemplate()
    setTimeout(() => {
      location.href = '/demo'
    }, 5000)
  } else {
    requestApi(`/api/questions/${questionId}/replies/${replyId}`, {
      method: 'put',
      token,
      body
    }).then((res) => {
      if (res.status !== 200) return onResponseError(res)
      stopSpinner()
      $body.innerHTML = thanksTemplate()
    })
  }
}

/**
 * Setup $poll to handle clicks.
 *
 * @param {Element} $poll
 */

function setupPoll ($poll) {
  const id = $poll.getAttribute('data-id')
  const $items = arrProto.slice.call($poll.querySelectorAll('.js-poll-item'))
  const $addComment = $poll.parentElement.querySelector('.js-addComment')
  let selected

  $addComment.addEventListener('click', () => {
    const $textarea = setupComment(id)
    $poll.parentElement.appendChild($textarea)
    $textarea.focus()
    if ($addComment) $addComment.classList.add('is-hidden')
  })

  toggleState(id, false)
  delegate($poll, '.js-poll-item', 'click', (e1) => {
    if (selected) {
      selected.classList.remove('is-selected')
    } else {
      $items.forEach(($el) => $el.classList.remove('is-empty'))
    }
    selected = e1.delegateTarget
    selected.classList.add('is-selected')
    const value = parseInt(selected.getAttribute('data-value'), 10)
    let $textarea = $poll.parentElement.querySelector('.js-textarea')
    if (!states[id]) toggleState(id, value)
    if (value <= 3) {
      if (!$textarea) {
        $textarea = setupComment(id)
        $poll.parentElement.appendChild($textarea)
        $textarea.focus()
        if ($addComment) $addComment.classList.add('is-hidden')
      }
    } else {
      if ($textarea && !$textarea.value) {
        $poll.parentElement.removeChild($textarea)
      }
      $addComment.classList.remove('is-hidden')
    }
  })

  // handle stars re-selection
  delegate($poll, '.js-poll-item', 'mouseover', () => {
    if (selected) selected.classList.remove('is-selected')
  })
  delegate($poll, '.js-poll-item', 'mouseout', () => {
    if (selected) selected.classList.add('is-selected')
  })
}

/**
 * Enable/disable send button when all polls are set.
 *
 * @param {String} key
 * @param {Boolean} val
 */

function toggleState (key, val) {
  states[key] = val
  if (Object.keys(states).every((stateKey) => states[stateKey])) {
    $button.removeAttribute('disabled')
  } else {
    $button.setAttribute('disabled', true)
  }
}

/**
 * Setup textarea for comment.
 *
 * @param {String} id
 */

function setupComment (id) {
  const $textarea = domify('<textarea class="question-textarea js-textarea"></textarea>')
  $textarea.placeholder = t('question-mood.client.placeholder')
  $textarea.addEventListener('input', (e2) => {
    const val = e2.target.value.trim()
    if (val) {
      comments[id] = val
    } else {
      delete comments[id]
    }
  })
  resizeTextarea($textarea, { size: '2rem' })
  return $textarea
}

/**
 * Setup mood changer.
 */

function setupMoodChanger () {
  delegate($moodValue, '.js-moodButton', 'click', (e) => {
    const $changer = domify(`
      <div class="question-mood-value__changer">
        <div class="question-mood-value__changer__title">
          ${t('question-mood.client.reselect')}
        </div>
        <div class="question-mood-value__changer__smileys js-smileys">
        </div>
      </div>
    `)

    const $smileys = $changer.querySelector('.js-smileys')
    arrProto.forEach.call($moodValue.querySelectorAll('svg'), ($svg, index) => {
      const $btn = domify('<button type="button"></button>')
      $btn.appendChild($svg.cloneNode(true))
      $btn.addEventListener('click', () => {
        mood = 5 - index // change mood
        $body.removeChild($changer)
        $moodValue.classList.remove('is-hide')
        $moodName.className = `question-mood-name js-moodName is-${mood}`
        $moodValue.querySelector(`.js-moodButton[data-value="${mood}"]`)
        .parentElement.classList.remove('is-hide')
        updateReply()
      })
      $smileys.appendChild($btn)
    })

    $moodValue.classList.add('is-hide')
    e.delegateTarget.parentElement.classList.add('is-hide')
    $body.insertBefore($changer, $moodValue)
  })
}

/**
 * Render thanks template.
 */

function thanksTemplate () {
  return `
    <h4 class="question-body__subtitle">
      ${t('question-mood.client.thanks')}
    </h4>
    <p class="question-body__text question-body__text--bold">
      ${t('question-mood.client.thanks-bye')}
    </p>
  `
}

/**
 * Send reply with `mood` value.
 *
 * @param {String} questionId
 * @param {String} token
 * @param {Number} mood
 * @return {Promise}
 */

function createReply () {
  if (isDemo) return Promise.resolve({})
  return requestApi(`/api/questions/${questionId}/replies`, {
    method: 'post',
    token,
    body: { mood, body: null, smileys: null, rating: null, yesno: null }
  }).then((res) => {
    if (res.status !== 201) return onResponseError(res)
    return res.json().then((val) => val.data)
  })
}

/**
 * Update reply with `mood` value.
 *
 * @param {String} questionId
 * @param {String} replyId
 * @param {String} token
 * @param {Number} mood
 * @return {Promise}
 */

function updateReply () {
  if (isDemo) return Promise.resolve({})
  if (!replyId) {
    forceUpdateMood = true
    return Promise.resolve({})
  }
  return requestApi(`/api/questions/${questionId}/replies/${replyId}`, {
    method: 'put',
    token,
    body: { mood }
  }).then((res) => {
    if (res.status !== 200) return onResponseError(res)
    return res.json().then((val) => val.data)
  })
}
