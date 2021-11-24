<template>
  <div class="team-page" v-if="team && team.name">
    <h3><strong>Team:</strong> {{team.name}}</h3>
    <div> 
      <strong>Created by: </strong> 
      <span> 
        <md-avatar style="margin: 0 10px;">
          <img :src="baseURL + '/api/user/avatar/' + team.host.id" alt="Avatar">
        </md-avatar>
        <strong>{{team.host.firstName}} {{team.host.lastName}}</strong>
      </span>
    </div>
    <div> 
      <strong>Created on: </strong> {{getTime(team.createdAt)}}
    </div>
    <div> 
      <strong>Last update on: </strong> {{getTime(team.updatedAt)}}
    </div>
    <div> 
      <strong>Members: </strong>
    </div>
    <div class="members-grid">
      <div v-for="member in team.members" :key="member.id">
        <span> 
        <md-avatar style="margin: 0 10px;">
          <img :src="baseURL + '/api/user/avatar/' + member.id" alt="Avatar">
        </md-avatar>
        <strong>{{member.firstName}} {{member.lastName}}</strong>
      </span>
      </div> 
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import timeMixin from '../../mixins/time'
import {baseURL} from '../../utils'

export default {
  name: 'Team',
  computed: {
     ...mapState({
      isTeamLoaded: (state) => state.team.isLoaded
    }),
    ...mapGetters({
      getTeamById: 'getTeamById'
    }),
    team() {
      return this.getTeamById(Number(this.$route.params.teamId))
    },
    baseURL() {
      return baseURL
    }
  },
  mounted() {
    if (!this.isTeamLoaded) {
      this.$store.dispatch('getAllTeams')
    }
  },
  mixins: [timeMixin]
}
</script>

<style lang="scss" scoped>
.team-page {
  padding: 0 15px;
  > div {
    margin: 5px 0;
  }
}
.members-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 10px;
}
</style>