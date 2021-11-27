<template>
  <div style="padding-left: 25px"> 
    <router-link :to="'/teams/' + team.id">
      <md-icon>arrow_back_ios</md-icon> Back to team
    </router-link>
    <div class="team-message-container" v-if="team.messages && team.messages.length" :key="team.messages.length">
      <div style="text-align: center;">
        <span>
          {{getTime(team.messages[0].createdAt)}}
        </span>
      </div>
      <message :message="team.messages[0]"
        :key="team.messages[0].id" :user-name="getMemberName(team.messages[0].userId)"
        :has-avatar="true"></message>
      <div v-for="(mess, idx) in team.messages.slice(1, team.messages.length - 1)" :key="mess.id"> 
        <div style="text-align: center;" v-if="messageTimeDiff(team.messages[idx].createdAt, team.messages[idx + 1].createdAt)">
          <span>
            {{messageTimeDiff(team.messages[idx].createdAt, team.messages[idx + 1].createdAt)}}
          </span>
        </div>
        <message
          :has-avatar="team.messages[idx].userId != team.messages[idx + 1].userId"
          :user-name="getMemberName(mess.userId)"
          :message="mess"></message> 
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import getTime from '../../mixins/time.js'
import Message from '../Message.vue'

export default {
  name: 'TeamMessages',
  computed: {
    ...mapState({
      isLoaded: (state) => state.team.isLoaded,
      team: (state) => state.team.team,
    }),
  },
  mounted() {
    if (!this.isLoaded) {
      this.$router.push(`/teams/${this.$route.params.teamId}`)
    }
  },
  methods: {
    getMemberName(userId) {
      let user = this.team.members.find(m => m.id == userId)
      if (user && user.userName) {
        return user.userName
      }
    }
  },
  components: {
    'message': Message
  },
  mixins: [getTime]
}
</script>

<style lang="scss" scoped>
.team-message-container {
  margin-top: 10px;
  height: 80vh;
  overflow-y: auto;
  .time-text {
    text-align: center;
  }
}
</style>>