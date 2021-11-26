<template>
  <div class="team-page" v-if="team && team.name">
    <router-link to="/teams">
      <md-icon>arrow_back_ios</md-icon> Teams
    </router-link>
    <h3><strong>Team:</strong> {{team.name}}</h3>
    <div> 
      <strong>Created by: </strong> 
      <span> 
        <md-avatar style="margin: 0 10px;">
          <img :src="baseURL + '/api/user/avatar/' + team.hostId" alt="Avatar">
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
      <h4><strong>Members: </strong></h4>
    </div>
    <div class="members-grid">
      <div v-for="member in team.members" :key="member.id">
        <md-menu>
          <md-icon md-menu-trigger>more_horiz</md-icon>
          <md-menu-content>
            <md-menu-item>Remove</md-menu-item>
          </md-menu-content>
        </md-menu>
        <span> 
          <md-avatar style="margin: 0 10px;">
            <img :src="baseURL + '/api/user/avatar/' + member.id" alt="Avatar">
          </md-avatar>
          <strong>{{member.userName}}</strong>
        </span>
      </div> 
    </div>
    <div> 
      <h4><strong>Request users: </strong></h4>
    </div>
    <p v-if="team.requestUsers.length === 0">
      No request users
    </p>
    <div class="members-grid">
      <div v-for="member in team.requestUsers" :key="member.id">
        <md-menu>
          <md-icon md-menu-trigger>more_horiz</md-icon>
          <md-menu-content>
            <md-menu-item>Confirm</md-menu-item>
            <md-menu-item>Remove</md-menu-item>
          </md-menu-content>
        </md-menu>
        <span> 
          <md-avatar style="margin: 0 10px;">
            <img :src="baseURL + '/api/user/avatar/' + member.id" alt="Avatar">
          </md-avatar>
          <strong>{{member.userName}}</strong>
        </span>
      </div> 
    </div>
    <div> 
      <h4><strong>Invited users: </strong></h4>
    </div>
    <p v-if="team.invitedUsers.length === 0">
      No invited users
    </p>
    <div class="members-grid">
      <div v-for="member in team.invitedUsers" :key="member.id">
        <md-menu>
          <md-icon md-menu-trigger>more_horiz</md-icon>
          <md-menu-content>
            <md-menu-item>Cancel</md-menu-item>
          </md-menu-content>
        </md-menu>
        <span> 
          <md-avatar style="margin: 0 10px;">
            <img :src="baseURL + '/api/user/avatar/' + member.id" alt="Avatar">
          </md-avatar>
          <strong>{{member.userName}}</strong>
        </span>
      </div> 
    </div>
    <div> 
      <h4><strong>Recent meetings: </strong></h4>
      <p v-if="team.meetings.length === 0">
        No meeting in this teams
      </p>
      <div class="team-meetings"> 
        <md-card v-for="(meeting, idx) in team.meetings.slice(0, 10)" :key="meeting.id">
          <md-card-header-text>
            <div class="md-title" style="word-wrap: break-all">
              <strong>{{idx + 1}}.</strong>
              Meeting created by {{getMeetingMemberName(meeting.hostId)}}
            </div>
          </md-card-header-text>
          <md-card-expand style="margin: 5px">
            <md-card-actions>
              <md-card-expand-trigger>
                <md-button class="md-icon-button">
                  <md-icon>keyboard_arrow_down</md-icon>
                </md-button>
              </md-card-expand-trigger>
            </md-card-actions>
          </md-card-expand>

          <md-card-expand-content>
            <md-card-content>
              <div><strong>Created at</strong> {{getTime(meeting.createdAt)}}</div>
              <div v-if="!meeting.active"><strong>Ended at</strong> {{getTime(meeting.updatedAt)}}</div>
              <div v-else>The meeting is in progress</div>
              <strong>Joined by</strong>
              <span v-for="member of meeting.members" :key="member.id">
                {{getMeetingMemberName(member.id)}}, 
              </span>
            </md-card-content>
          </md-card-expand-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import timeMixin from '../../mixins/time'
import {baseURL} from '../../utils'

export default {
  name: 'Team',
  computed: {
     ...mapState({
      isLoaded: (state) => state.team.isLoaded,
      isTeamLoaded: (state) => state.team.isTeamLoaded,
      team: (state) => state.team.team,
      teams: (state) => state.team.teams
    }),
    baseURL() {
      return baseURL
    }
  },
  mounted() {
    if (!this.isLoaded) {
      this.$store.dispatch('getAllTeams')
    }
    if (this.isLoaded) {
      this.$store.dispatch('getTeamInfo', {teamId: Number(this.$route.params.teamId)})
    }
  },
  methods: {
    getMeetingMemberName(memberId) {
      if (this.team) {
        let member = this.team.members.find(m => m.id == memberId)
        return member.userName
      }
    }
  },
  watch: {
    'teams.length'(newVal) {
      if (newVal) {
        if (!this.isTeamLoaded) {
          this.$store.dispatch('getTeamInfo', {teamId: Number(this.$route.params.teamId)})
        }
      }
    },
    // $route() {
    //   console.log('route change')
    //   this.$store.dispatch('getTeamInfo', {teamId: Number(this.$route.params.teamId)})
    // }
  },
  mixins: [timeMixin]
}
</script>

<style lang="scss" scoped>
.team-page {
  padding: 0 15px;
  min-height: 80vh;
  .md-card {
    margin: 10px 0;
    border: none;
    box-shadow: none;
    background: transparent;
    .md-title {
      font-size: 20px;
    }
    .md-card-actions {
      background-color: transparent !important;
    }
  }
}
.members-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 10px;
  margin-left: 20px;
  > div {
    display: flex;
    align-items: center;
  }
}
.team-meetings {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 10px;
  margin-left: 20px;
}
p {
  margin-left: 20px;
}
.md-menu i {
  cursor: pointer;
}
</style>