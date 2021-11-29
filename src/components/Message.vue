<template>
  <div> 
    <div v-if="hasAvatar" class="user-avatar-container"> 
      <div class="message-user-name">{{userName}}</div>
      <!-- <md-avatar v-if="hasAvatar">
        <img :src="baseURL + '/api/user/avatar/' + message.userId" alt="Avatar" />
      </md-avatar> -->
    </div>
    <div class="message-container" style="display: flex;">
       <md-avatar v-if="hasAvatar">
        <img :src="baseURL + '/api/user/avatar/' + message.userId" alt="Avatar" />
      </md-avatar>
      <div> 
        <div v-if="message.photos && message.photos.length" :style="{
          marginLeft: hasAvatar ? '10px' : '50px'
        }">
          <div v-if="message.photos.length > 1" class="message-photo-list">
            <img v-for="(photo, idx) in message.photos" :key="idx" 
              @click="handlePreviewImg(message.id, photo.id)"
              :src="baseURL + '/api/messages/' + message.id + '/' + photo.id"
              :class="hasAvatar ? 'photo-last-message' : ''"
              :style="{
                width: getImageSize(message.photos.length).itemWidth,
                height: getImageSize(message.photos.length).height,
              }" /> 
          </div>
          <div v-else class="message-photo-list">
            <img v-for="(photo, idx) in message.photos" :key="idx" 
              @click="handlePreviewImg(message.id, photo.id)"
              :src="baseURL + '/api/messages/' + message.id + '/' + photo.id"
              :class="hasAvatar ? 'photo-last-message' : ''"
              :style="{
                maxWidth: getImageSize(message.photos.length).itemWidth,
                maxHeight: getImageSize(message.photos.length).height,
              }" /> 
          </div>
        </div>
        <div v-if="message.files && message.files.length" class="message-file-list" 
          :style="{
            marginLeft: hasAvatar ? '10px' : '50px'
          }">
          <div v-for="(file, idx) in message.files" :key="idx" class="message-file" 
            @click="handleFileDownload(file.id)">
            <md-icon>description</md-icon>
            {{file.name}}
          </div>
        </div>
        <p v-if="message.content" :style="{
          marginLeft: hasAvatar ? '10px' : '50px'
        }">
          {{message.content}}
        </p>
        <md-menu md-direction="bottom-start">
          <span class="material-icons menu-trigger-icon" md-menu-trigger>
            more_horiz
          </span>

          <md-menu-content>
            <md-menu-item style="cursor: pointer;" @click="handleDelete">Remove</md-menu-item>
          </md-menu-content>
        </md-menu>
      </div>
      <md-tooltip md-direction="left">{{getTime(message.createdAt)}}</md-tooltip>
    </div>

    <md-dialog :md-active.sync="isPreviewImg" >
      <md-dialog-content>
        <img width="100%" height="100%" :src="imagePreviewUrl" />
      </md-dialog-content>
    </md-dialog>

    <md-button v-if="isPreviewImg" @click="handleImageDownload" :style="{position: 'fixed',
            right: '150px',
            top: '20px',
            zIndex: 1000,
            padding: '5px',}">
      <md-icon> 
        file_download
      </md-icon>
    </md-button>

    <md-button v-if="isPreviewImg" @click="handleClose" :style="{position: 'fixed',
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
import time from '../mixins/time'

export default {
  name: 'Message',
  props: ['message', 'hasAvatar', 'userName'],
  data() {
    return {
      isPreviewImg: false,
      selectedPhotoId: false,
      imagePreviewUrl: null
    }
  },
  methods: {
    getImageSize(numOfPhotos) {
      let itemWidth, height, width
      if (numOfPhotos == 1) {
        if (this.message.meetingId) {
          itemWidth = '200px',
          width = '200px',
          height = '200px'
        } else {
          itemWidth = '350px';
          width = '350px';
          height = '400px'
        }
      } else if (numOfPhotos <= 3) {
        width = '410px';
        itemWidth = '200px'
        height = '200px'
      } else {
        width = '470px';
        itemWidth = '150px'
        height = '150px'
      }
      return { itemWidth, height, width }
    },
    handlePreviewImg(messageId, photoId) {
      this.selectedPhotoId = photoId
      this.imagePreviewUrl = this.baseURL + '/api/messages/' + this.message.id + '/' + photoId
      this.isPreviewImg = true 
    },
    handleClose() {
      this.selectedPhotoId = false
      this.imagePreviewUrl = null
      this.isPreviewImg = false
    },
    handleImageDownload() {
      window.open(`${this.baseURL}/api/messages/photos/${this.message.id}/${this.selectedPhotoId}`)
    },
    handleFileDownload(fileId) {
      window.open(`${this.baseURL}/api/messages/files/${this.message.id}/${fileId}`)
    },
    handleDelete() {
      if (this.message.teamId) {
        this.$store.dispatch('deleteTeamMessage', {messageId: this.message.id})
      } else if (this.message.meetingId) {
        this.$store.dispatch('deleteMeetingMessage', {messageId: this.message.id})
      }
    }
  },
  mixins: [time]
}
</script>

<style lang="scss" scoped>
.user-avatar-container {
  margin-left: 20px;
}
.message-container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 5px;
}
.message-container > div {
  display: flex;
  align-items: center;
}
.message-container p {
  margin-bottom: 0;
  padding: 5px;
  max-width: 500px;
  background-color: gray;
  color: #FFF;
  border-radius: 10px;
}
.message-container .md-avatar {
  margin: 0;
}
.message-user-name {
  margin-bottom: 5px;
  font-weight: 500;
}
.message-photo-list {
  display: flex;
  max-width: 500px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.message-photo-list > img,
.message-photo-list > div {
  border-radius: 15px;
  margin-right: 5px;
  margin-bottom: 5px;
  cursor: pointer;
}
.message-file-list {
  display: flex;
  max-width: 470px;
  flex-direction: column;
  margin-bottom: 8px;
}

.message-file-list .message-file {
  background: #f0f2f5;
  display: flex;
  padding: 10px;
  border-radius: 10px;
  margin: 1px;
  align-items: center;
  cursor: pointer;
}

.message-file span {
  color: #000;
  font-weight: 600;
}

.md-dialog-container.md-theme-default {
  background-color: transparent !important;
}

.md-dialog-container {
  box-shadow: none !important;
}

.menu-trigger-icon {
  cursor: pointer;
  color: transparent;
}

.message-container:hover .menu-trigger-icon {
  color: gray;
}
</style>