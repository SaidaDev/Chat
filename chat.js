const createChatItem = (text, isRight) => {
  const templ = document.querySelector('#chat')
  const el = templ.content.cloneNode(true)
  const chatItem = el.querySelector('.chat-item')
  const span = document.createElement('span')
  span.innerText = text
  chatItem.appendChild(span)
  if (isRight) {
    chatItem.classList.add('right')
  }
  return el
}

const createChatImage = (src, isRight) => {
  const templ = document.querySelector('#img')
  const el = templ.content.cloneNode(true)
  const chatImg = el.querySelector('.chat-img img')
  const chatItem = el.querySelector('.chat-img')
  chatImg.src = src
  if (isRight) {
    chatItem.classList.add('right')
  }
  return el
}

const chatBox = document.querySelector('.chat-box')
const input = document.querySelector('.input')
const video = document.querySelector('video')
const canvas = document.querySelector('canvas')
const camera = document.querySelector('.camera')
const file = document.querySelector('.file input')
const mic = document.querySelector('.mic.btn')

input.addEventListener('keypress', (event) => {
  if (event.keyCode === 13 && !event.shiftKey && isInputValid()) {
    event.preventDefault()
    const chatItem = createChatItem(input.value, true)
    chatBox.appendChild(chatItem)
    input.value = ''
    setTimeout(sayOk, 1000)
    scrollToBottom()
  }
})

const isInputValid = () => {
  return input.value !== ''
}

const answers = ['ok\n i agree', 'yes😂🤣', 'no']

const sayOk = () => {
  const wordIndex = Math.floor(Math.random() * answers.length)
  const chatItem = createChatItem(answers[wordIndex], false)
  chatBox.appendChild(chatItem)
  scrollToBottom()
}

const replyPhoto = () => {
  const random = Math.random()
  const chatItem = createChatImage(
    'https://picsum.photos/200/300/?random=' + random,
    false
  )
  chatBox.appendChild(chatItem)
  scrollToBottom()
}

const scrollToBottom = () => {
  chatBox.scrollTop = chatBox.scrollHeight
}

camera.addEventListener('click', async () => {
  const src = await doScreenshot()
  const el = createChatImage(src, true)
  chatBox.appendChild(el)
  setTimeout(replyPhoto, 1000)
  scrollToBottom()
})

const doScreenshot = async () => {
  const constraints = {
    video: {
      width: {
        min: 640,
      },
      height: {
        min: 480,
      },
    },
  }
  const stream = await navigator.mediaDevices.getUserMedia(constraints)

  video.srcObject = stream
  await video.play()

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  canvas.getContext('2d').drawImage(video, 0, 0)

  video.pause()
  return canvas.toDataURL('image/webp')
}

const reader = new FileReader()

reader.addEventListener('load', (e) => {
  const chatItem = createChatImage(e.target.result, true)
  setTimeout(replyPhoto, 1000)
  chatBox.appendChild(chatItem)
  scrollToBottom()
})

file.addEventListener('change', () => {
  if (file.files && file.files[0]) {
    reader.readAsDataURL(file.files[0])
  }
})

const createAudioItem = (src, isRight) => {
  const templ = document.querySelector('#audio')
  const el = templ.content.cloneNode(true)
  const chatItem = el.querySelector('.chat-audio')
  if (isRight) {
    chatItem.classList.add('right')
  }
  const audio = el.querySelector('.chat-audio audio')
  audio.src = src
  return el
}

let mediaRecorder
let audioChunks

mic.addEventListener('mousedown', async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  mediaRecorder = new MediaRecorder(stream)
  audioChunks = []
  mediaRecorder.addEventListener('dataavailable', (event) => {
    audioChunks.push(event.data)
  })
  mediaRecorder.start()
  mediaRecorder.addEventListener('stop', () => {
    const audioBlob = new Blob(audioChunks)
    const audioUrl = URL.createObjectURL(audioBlob)
    const el = createAudioItem(audioUrl, true)
    chatBox.appendChild(el)
    scrollToBottom()
  })
})

mic.addEventListener('mouseup', () => {
  if (mediaRecorder) {
    mediaRecorder.stop()
  }
})
