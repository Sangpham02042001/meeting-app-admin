<template>
  <div class="meeting-page">
    <router-link to="/meetings">
      <md-icon>arrow_back_ios</md-icon> Meetings
    </router-link>
    <div v-if="meeting && meeting.id">
      <h5>Meeting ID: {{meeting.id}}</h5>
      <div> 
        <strong>Created by: </strong> 
        <span> 
          <md-avatar style="margin: 0 10px;">
            <img :src="baseURL + '/api/user/avatar/' + meeting.hostId" alt="Avatar" />
          </md-avatar>
          <strong>{{meeting.host.firstName}} {{meeting.host.lastName}}</strong>
        </span>
      </div>
      <div> 
        <strong>Created on: </strong> {{getTime(meeting.createdAt)}}
      </div>
      <div> 
        <strong>Last update on: </strong> {{getTime(meeting.updatedAt)}}
      </div>
      <div class="members-grid" v-if="meeting.members && meeting.members.length">
        <div v-for="member in meeting.members" :key="member.id">
          <md-menu v-if="member.id !== meeting.hostId">
            <md-icon md-menu-trigger>more_horiz</md-icon>
            <md-menu-content>
              <md-menu-item style="cursor: pointer;">Remove</md-menu-item>
            </md-menu-content>
          </md-menu>
          <span :style="{
            marginLeft: member.id === meeting.hostId ? '24px' : 0
          }"> 
            <md-avatar style="margin: 0 10px;">
              <img :src="baseURL + '/api/user/avatar/' + member.id" alt="Avatar">
            </md-avatar>
            <strong>{{member.firstName + ' ' + member.lastName}}</strong>
          </span>
        </div>
      </div>
      <h4 v-else>No members in this meeting</h4>
      <div class="team-message-container" v-if="meeting.messages && meeting.messages.length" :key="meeting.messages.length">
        <div style="text-align: center;">
          <span>
            {{getTime(meeting.messages[0].createdAt)}}
          </span>
        </div>
        <message :message="meeting.messages[0]"
          :key="meeting.messages[0].id" :user-name="getMemberName(meeting.messages[0].userId)"
          :has-avatar="true"></message>
        <div v-for="(mess, idx) in meeting.messages.slice(1, meeting.messages.length)" :key="mess.id"> 
          <div style="text-align: center;" v-if="messageTimeDiff(meeting.messages[idx].createdAt, meeting.messages[idx + 1].createdAt)">
            <span>
              {{messageTimeDiff(meeting.messages[idx].createdAt, meeting.messages[idx + 1].createdAt)}}
            </span>
          </div>
          <message
            :has-avatar="meeting.messages[idx].userId != meeting.messages[idx + 1].userId"
            :user-name="getMemberName(mess.userId)"
            :message="mess"></message> 
        </div>
      </div>
      <h4 v-else>No messages in this meeting</h4>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import timeMixin from '../../mixins/time'
import Message from '../Message.vue'

export default {
  name: 'Meeting',
  computed: { 
    ...mapState({
      isMeetingsLoaded: (state) => state.meeting.isMeetingsLoaded,
      isMeetingLoaded: (state) => state.meeting.isMeetingLoaded,
      meeting: (state) => state.meeting.meeting,
      meetings: (state) => state.meeting.meetings
    }),
  },
  methods: {
    getMemberName(userId) {
      let user = this.meeting.members.find(m => m.id == userId)
      if (user && user.id) {
        return user.firstName + ' ' + user.lastName 
      }
    }
  },
  mounted() {
    if (!this.isMeetingsLoaded) {
      this.$store.dispatch('getAllMeetings')
    }
    if (this.isMeetingsLoaded) {
      this.$store.dispatch('getMeetingById', {meetingId: Number(this.$route.params.meetingId)})
    }
  },
  watch: {
    'meetings.length'(newVal) {
      if (newVal) {
        if (!this.isMeetingLoaded) {
          this.$store.dispatch('getMeetingById', {meetingId: Number(this.$route.params.meetingId)})
        }
      }
    },
  },
  components: {
    'message': Message
  },
  mixins: [timeMixin]
}
</script>

<style lang="scss" scoped>
.meeting-page {
  padding: 0 15px;
  min-height: 80vh;
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
</style>