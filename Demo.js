const readline = require('readline')

const Oscillator = require('./index')
const oscillator = new Oscillator()

let freq = 440
let vol = 50
let playing = false

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)

process.stdin.on('keypress', (_, { name }) => {
  if (name === 'q') {
    process.exit(0)
  }

  if (name === 'up') {
    vol += 5
    oscillator.setVolume(vol)
    console.log('Current volume:', vol)
  }

  if (name === 'down') {
    vol -= 5
    oscillator.setVolume(vol)
    console.log('Current volume:', vol)
  }

  if (name === 'right') {
    freq += 20
    oscillator.changeFrequencySmooth(freq)
    console.log('Current frequency:', freq)
  }

  if (name === 'left') {
    freq -= 20
    oscillator.changeFrequencySmooth(freq)
    console.log('Current frequency:', freq)
  }

  if (name === 'space') {
    if (!playing) {
      oscillator.create()
      console.log('Started.')
    } else {
      oscillator.stop()
      console.log('Stopped.')
    }
    playing = !playing
  }

  if (name === 'r') {
    const types = ['square', 'sine', 'sawtooth', 'triangle']
    const randomType = types[Math.floor(Math.random() * types.length)]
    oscillator.changeFrequencyType(randomType)
    console.log('Current frequency type:', randomType)
  }
})

console.log('PRESS Q TO QUIT...')
