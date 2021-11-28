<template>
  <div style="padding-left: 25px">
    <router-link :to="'/teams/' + team.id">
      <md-icon>arrow_back_ios</md-icon> Back to team
    </router-link>
    <div class='shared-media-list' v-if="team.images && team.images.length">
      <div
        v-for="(img, idx) in team.images" :key="idx"
        @click="handlePreviewImage(img.messageId, img.id)"
        :style="{backgroundImage: `url(${imgPath}/${img.messageId}/${img.id})`}"></div>
    </div>
    <h5 v-else>No image in this team</h5>
    <preview-image :is-preview="isPreview" :on-close="closePreview"
      :message-id="messageId" :photo-id="photoId" />
  </div>
</template>

<script>
import {mapState} from 'vuex'
import PreviewImage from '../PreviewImage.vue'

export default {
  name: 'TeamImages',
  data() {
    return {
      isPreview: false,
      messageId: null,
      photoId: null
    }
  },
  computed: {
    ...mapState({
      team: state => state.team.team,
      isLoaded: state => state.team.isLoaded
    }),
    imgPath() {
      return this.baseURL + '/api/messages'
    }
  },
  mounted() {
    if (!this.isLoaded) {
      this.$router.push(`/teams/${this.$route.params.teamId}`)
    }
  },
  methods: {
    handlePreviewImage(messageId, photoId) {
      this.isPreview= true
      this.messageId = messageId
      this.photoId = photoId
    },
    closePreview() {
      this.isPreview = false
      this.messageId = null
      this.photoId = null
    }
  },
  components: {
    'preview-image': PreviewImage
  }
}
</script>

<style lang="scss" scoped>
.shared-media-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 10px;
  row-gap: 10px;
  margin: auto;
  margin-top: 20px;
}

.shared-media-list div {
  height: 150px;
  width: 250px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 10px;
  cursor: pointer;
}
</style>