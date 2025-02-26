<template>
  <img
    ref="streamingElement"
    :src="cameraImageSource"
    :style="cameraStyle"
    @load="handleImageLoad"
  >
</template>

<script lang="ts">
import { Component, Mixins, Ref } from 'vue-property-decorator'
import CameraMixin from '@/mixins/camera'

@Component({})
export default class MjpegstreamerAdaptiveCamera extends Mixins(CameraMixin) {
  @Ref('streamingElement')
  readonly cameraImage!: HTMLImageElement

  cameraImageSource = ''
  requestStartTime = performance.now()
  startTime = performance.now()
  time = 0
  requestTime = 0
  timeSmoothing = 0.6
  requestTimeSmoothing = 0.1

  handleImageLoad () {
    const fpsTarget = (!document.hasFocus() && this.camera.targetFpsIdle) || this.camera.targetFps || 10
    const endTime = performance.now()
    const currentTime = endTime - this.startTime

    this.time = (this.time * this.timeSmoothing) + (currentTime * (1.0 - this.timeSmoothing))

    this.startTime = endTime

    const targetTime = 1000 / fpsTarget

    const currentRequestTime = performance.now() - this.requestStartTime

    this.requestTime = (this.requestTime * this.requestTimeSmoothing) + (currentRequestTime * (1.0 - this.requestTimeSmoothing))

    const timeout = Math.max(0, targetTime - this.requestTime)

    this.$nextTick(() => {
      setTimeout(this.handleRefresh, timeout)
    })
  }

  handleRefresh () {
    if (!document.hidden) {
      const framesPerSecond = Math.round(1000 / this.time).toLocaleString(undefined, { minimumIntegerDigits: 2 })

      this.$emit('frames-per-second', framesPerSecond)

      this.$nextTick(() => {
        const url = new URL(this.cameraImageSource)

        url.searchParams.set('cacheBust', Date.now().toString())

        this.requestStartTime = performance.now()

        this.cameraImageSource = url.toString()
      })
    } else {
      this.stopPlayback()
    }
  }

  startPlayback () {
    const url = new URL(this.cameraUrl)

    this.requestStartTime = performance.now()

    if (!url.searchParams.get('action')?.startsWith('snapshot')) {
      url.searchParams.set('action', 'snapshot')
    }

    url.searchParams.set('cacheBust', Date.now().toString())

    this.cameraImageSource = url.toString()

    url.searchParams.set('action', 'stream')

    this.$emit('raw-camera-url', url.toString())
  }

  stopPlayback () {
    this.cameraImageSource = ''
    this.cameraImage.src = ''
  }
}
</script>
