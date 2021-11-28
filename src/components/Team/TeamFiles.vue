<template>
   <div style="padding-left: 25px">
    <router-link :to="'/teams/' + team.id">
      <md-icon>arrow_back_ios</md-icon> Back to team
    </router-link>
    <div class='shared-file-list' v-if="team.files && team.files.length">
      <div
        v-for="(file, idx) in team.files" :key="idx"
        @click="handleDownload(file.messageId, file.id)">
          <md-icon>description</md-icon>
          {{file.name}}
        </div>
    </div>
    <h5 v-else>No file in this team</h5>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'TeamFiles',
  computed: {
    ...mapState({
      team: state => state.team.team,
      isLoaded: state => state.team.isLoaded
    }),
  },
  mounted() {
    if (!this.isLoaded) {
      this.$router.push(`/teams/${this.$route.params.teamId}`)
    }
  },
  methods: {
    handleDownload(messageId, fileId) {
      window.open(`${this.baseURL}/api/messages/files/${messageId}/${fileId}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.shared-file-list  {
  display: flex;
  flex-wrap: wrap;
}
.shared-file-list > div {
  background: #f0f2f5;
  display: flex;
  padding: 10px;
  border-radius: 10px;
  margin: 10px;
  align-items: center;
  cursor: pointer;
  max-width: 200px;
}
.md-icon {
  margin: 0;
}
</style>