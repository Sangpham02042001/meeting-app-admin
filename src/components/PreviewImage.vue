<template>
  <div>
    <md-dialog :md-active.sync="isPreview" :md-close-on-esc="false">
      <md-dialog-content>
        <img width="100%" height="100%" :src="imgPath + '/'  + messageId + '/' + photoId" />
      </md-dialog-content>
    </md-dialog>

    <md-button v-if="isPreview" @click="handleImageDownload" :style="{position: 'fixed',
            right: '150px',
            top: '20px',
            zIndex: 1000,
            padding: '5px',}">
      <md-icon> 
        file_download
      </md-icon>
    </md-button>

    <md-button v-if="isPreview" @click="onClose" :style="{position: 'fixed',
            right: '20px',
            top: '20px',
            zIndex: 1000,
            padding: '5px',}">
      <md-icon> 
        close
      </md-icon>
    </md-button>
  </div>
</template>

<script>
export default {
  name: 'PreviewImage',
  props: ['isPreview', 'onClose', 'messageId', 'photoId'],
  computed: {
    imgPath() {
      return this.baseURL + '/api/messages'
    }
  },
  methods: {
    handleImageDownload(event) {
      event.preventDefault()
      window.open(`${this.baseURL}/api/messages/photos/${this.messageId}/${this.photoId}`)
    }
  }
}
</script>

<style>

</style>