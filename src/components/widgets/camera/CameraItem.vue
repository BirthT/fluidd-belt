<template>
  <v-sheet
    :elevation="0"
    class="camera-container"
    v-on="$listeners"
  >
    <template v-if="cameraComponent">
      <component
        :is="cameraComponent"
        :camera="camera"
        class="camera-image"
        @raw-camera-url="rawCameraUrl = $event"
        @frames-per-second="framesPerSecond = $event"
      />
    </template>
    <div v-else>
      Camera service not supported!
    </div>

    <div
      v-if="camera.name"
      class="camera-name"
    >
      {{ camera.name }}
    </div>
    <div
      v-if="framesPerSecond"
      class="camera-frames"
    >
      fps: {{ framesPerSecond }}
    </div>

    <div
      v-if="!fullscreen && (fullscreenMode === 'embed' || !rawCameraUrl)"
      class="camera-fullscreen"
    >
      <a :href="`/#/camera/${camera.id}`">
        <v-icon>$fullScreen</v-icon>
      </a>
    </div>
    <div
      v-else-if="rawCameraUrl"
      class="camera-fullscreen"
    >
      <a
        :href="rawCameraUrl"
        target="_blank"
      >
        <v-icon>$openInNew</v-icon>
      </a>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { CameraConfig } from '@/store/cameras/types'
import { CameraFullscreenAction } from '@/store/config/types'
import { CameraComponents } from '@/dynamicImports'

@Component({})
export default class CameraItem extends Vue {
  @Prop({ type: Object, required: true })
  readonly camera!: CameraConfig

  @Prop({ type: Boolean, required: false, default: false })
  readonly fullscreen!: boolean

  rawCameraUrl: string | null = null
  framesPerSecond : string | null = null

  @Watch('camera')
  onCamera () {
    this.rawCameraUrl = ''
    this.framesPerSecond = ''
  }

  get fullscreenMode (): CameraFullscreenAction {
    return this.$store.state.config.uiSettings.general.cameraFullscreenAction
  }

  get cameraComponent () {
    if (this.camera.service) {
      const componentName = `${this.$filters.startCase(this.camera.service).replace(' ', '')}Camera`

      if (componentName in CameraComponents) {
        return CameraComponents[componentName]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .camera-image {
    display: block;
    max-width: 100%;
    max-height: calc(100vh - 56px - 32px);
    white-space: nowrap;
    margin: auto;
  }

  .camera-container {
    position: relative;
    background: rgba(0, 0, 0, 1);
  }

  .camera-name,
  .camera-frames {
    position: absolute;
    bottom: 0;
    padding: 2px 6px;
    background: rgba(0, 0, 0, 0.75);
    font-weight: 100;
  }

  .theme--light .camera-name,
  .theme--light .camera-frames {
    background: rgba(255, 255, 255, 0.75);
  }

  .camera-fullscreen {
    position: absolute;
    text-align: right;
    top: 0;
    right: 0;
    padding: 2px 6px;
    background: rgba(0, 0, 0, 0.75);
    border-bottom-left-radius: 4px;
  }

  .theme--light .camera-fullscreen {
    background: rgba(255, 255, 255, 0.75);
  }

  .camera-name {
    left: 0;
    border-top-right-radius: 4px;
  }

  .camera-frames {
    text-align: right;
    right: 0;
    border-top-left-radius: 4px;
  }
</style>
