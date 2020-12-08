const Speaker = require('speaker')
const AudioContext = require('web-audio-engine').StreamAudioContext

const clamp = (val, min, max) => {
  if (val < min) return min
  if (val > max) return max
  return val
}

module.exports = class SoundHelper {
  constructor () {
    // node-speaker
    this.speaker = this._initSpeaker()
    // AudioContext port
    this.ctx = new AudioContext()
    // Oscillator
    this.osc = this.ctx.createOscillator()
    this.changeFrequencyFast(440)
    // Gain Node
    this.amp = this.ctx.createGain()
    this.amp.connect(this.ctx.destination)
    // Pipe output to speaker
    this.ctx.pipe(this.speaker)
    this.ctx.resume()

    this.initialized = false
  }

  _initSpeaker (device = null) {
    return new Speaker({
      device, // hw:0,0 - hw:1,0
      channels: 1,
      bitDepth: 16,
      sampleRate: 44100,
      samplesPerFrame: 128
    })
  }

  create (frequencyType = 'sine') {
    if (this.initialized) { return }

    this.osc.type = frequencyType
    this.osc.start()
    this.osc.connect(this.amp)
    this.initialized = true
  }

  stop () {
    if (!this.initialized) { return }

    this.osc.disconnect()
    this.initialized = false
  }

  changeFrequencySmooth (freqHz) {
    if (isNaN(freqHz) || freqHz > 22050) {
      return
    }
    const givenFreq = clamp(freqHz, 0, 22050)
    const freqToSet = givenFreq * 2 // To compensate single channel "Speaker"
    this.osc.frequency.setTargetAtTime(freqToSet, this.ctx.currentTime + 0, 0.10)
  }

  changeFrequencyFast (freqHz) {
    const freqToSet = freqHz * 2 // To compensate single channel "Speaker"
    this.osc.frequency.setValueAtTime(freqToSet, this.ctx.currentTime)
  }

  changeFrequencyType (frequencyType) {
    this.osc.type = frequencyType
  }

  setVolume (volumePercent) {
    let vol = clamp(volumePercent, 0, 100)
    this.amp.gain.value = vol / 100 // Gain value is between 0-1
  }
}
