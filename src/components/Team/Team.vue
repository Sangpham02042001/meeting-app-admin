<template>
  <div class="team-page" v-if="team && team.name">
    <router-link to="/teams">
      <md-icon>arrow_back_ios</md-icon> Teams
    </router-link>
    <div style="display: flex; align-items: center;"> 
      <span class="team-edit-button" @click="showEditTeamDialog = true">
        <md-icon>edit</md-icon>
      </span>
      <md-button class="md-dense md-icon-button" @click="reloadTeam">
        <md-tooltip md-direction="top">Reload</md-tooltip>
        <md-icon>autorenew</md-icon>
      </md-button>
    </div>
    <div class="team-intro">
      <div>
        <h3 style="margin-top: 0;">
          <strong>Team:</strong> {{team.name}}
        </h3>
        <div><strong>Team type:</strong> {{team.teamType}} </div>
        <div> 
          <strong>Created by: </strong> 
          <span> 
            <md-avatar style="margin: 0 10px;">
              <img :src="baseURL + '/api/user/avatar/' + team.hostId" alt="Avatar" />
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
      </div>
      <!-- <md-avatar>
        <img :src="baseURL + '/api/team/coverphoto/' + team.id" alt="Avatar">
      </md-avatar> -->
      <div class="team-avatar" :key="team.coverPhoto" :style="{
        backgroundImage: 'url(' + baseURL + '/api/team/coverphoto/' + team.id + '?key=' + team.coverPhoto + ')'
      }"> 
      </div>
    </div>
    <div>
      <h5>
        <router-link :to="'/teams/' + team.id + '/messages'">
          View messages in this team
        </router-link> 
      </h5>
      <h5>
        <router-link :to="'/teams/' + team.id + '/files'">
          View shared files in this team
        </router-link> 
      </h5>
      <h5>
        <router-link :to="'/teams/' + team.id + '/images'">
          View shared images in this team
        </router-link> 
      </h5>
    </div>
    <div> 
      <h4><strong>Members: </strong></h4>
    </div>
    <div class="members-grid">
      <div v-for="member in team.members" :key="member.id">
        <md-menu v-if="member.id !== team.hostId">
          <md-icon md-menu-trigger>more_horiz</md-icon>
          <md-menu-content>
            <md-menu-item style="cursor: pointer;" @click="handleRemoveMember(member.id)">Remove</md-menu-item>
          </md-menu-content>
        </md-menu>
        <span :style="{
          marginLeft: member.id === team.hostId ? '24px' : 0
        }"> 
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
            <md-menu-item style="cursor: pointer;" @click="handleConfirmRequest(member.id)">Confirm</md-menu-item>
            <md-menu-item style="cursor: pointer;" @click="handleRemoveRequest(member.id)">Remove</md-menu-item>
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
            <md-menu-item style="cursor: pointer;" @click="handleRemoveInvitation(member.id)">Cancel</md-menu-item>
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

    <md-dialog-confirm
      :md-active.sync="showRemoveMemberDialog"
      :md-title="'Delete this member from team' + team.name"
      md-confirm-text="Agree"
      md-cancel-text="Disagree"
      @md-cancel="onCancelRemoveMember"
      @md-confirm="onConfirmRemoveMember" />

    <md-dialog-confirm
      :md-active.sync="showRemoveInvitationDialog"
      md-title="Cancel invite this user ?"
      md-confirm-text="Agree"
      md-cancel-text="Disagree"
      @md-cancel="onCancelRemoveInvitation"
      @md-confirm="onConfirmRemoveInvitation" />

    <md-dialog-confirm
      :md-active.sync="showRemoveRequestDialog"
      md-title="Remove this user's request ?"
      md-confirm-text="Agree"
      md-cancel-text="Disagree"
      @md-cancel="onCancelRemoveRequest"
      @md-confirm="onConfirmRemoveRequest" />

    <md-dialog-confirm
      :md-active.sync="showConfirmRequestDialog"
      md-title="Confirm this user's request ?"
      md-confirm-text="Agree"
      md-cancel-text="Disagree"
      @md-cancel="onCancelConfirmRequest"
      @md-confirm="onConfirmRequest" />

    <md-dialog :md-active.sync="showEditTeamDialog">
      <md-dialog-title>Edit team</md-dialog-title>
      <md-dialog-content>
        <md-field>
          <label>Team name</label>
          <md-input v-model="teamName"></md-input>
        </md-field>
        <md-checkbox v-model="isPublicTeam">Public Team</md-checkbox>
        <md-field>
          <label>Team Coverphoto</label>
          <md-file v-model="image" @change="onImageChange" accept="image/*" />
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="cancelEdit">Cancel</md-button>
        <md-button class="md-primary" @click="comfirmEdit">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import timeMixin from '../../mixins/time'
import {baseURL} from '../../utils'

export default {
  name: 'Team',
  data() {
    return {
      selectedUserId: null,
      showRemoveMemberDialog: false,
      showRemoveInvitationDialog: false,
      showRemoveRequestDialog: false,
      showConfirmRequestDialog: false,
      showEditTeamDialog: false,
      teamName: '',
      isPublicTeam: true,
      coverPhoto: null,
      image: ''
    }
  },
  computed: {
     ...mapState({
      isLoaded: (state) => state.team.isLoaded,
      isTeamLoaded: (state) => state.team.isTeamLoaded,
      team: (state) => state.team.team,
      teams: (state) => state.team.teams
    }),
    baseURL() {
      return baseURL
    },
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
        if (!member) {
          return ''
        }
        return member.userName
      }
    },
    //remove member
    handleRemoveMember(userId) {
      this.selectedUserId = userId
      this.showRemoveMemberDialog = true
    },
    onCancelRemoveMember() {
      this.selectedUserId = null
      this.showRemoveMemberDialog = false
    },
    onConfirmRemoveMember() {
      this.$store.dispatch('removeMembers', {
        teamId: this.team.id,
        userId: this.selectedUserId
      })
    },

    //cancel invitation
    handleRemoveInvitation(userId) {
      this.selectedUserId = userId
      this.showRemoveInvitationDialog = true
    },
    onCancelRemoveInvitation() {
      this.selectedUserId = null
      this.showRemoveInvitationDialog = false
    },
    onConfirmRemoveInvitation() {
      this.$store.dispatch('cancelInvitation', {
        teamId: this.team.id,
        userId: this.selectedUserId
      })
      this.selectedUserId = null
      this.showRemoveInvitationDialog = false
    },

    //remove request
    handleRemoveRequest(userId) {
      this.selectedUserId = userId
      this.showRemoveRequestDialog = true
    },
    onCancelRemoveRequest() {
      this.selectedUserId = null
      this.showRemoveRequestDialog = false
    },
    onConfirmRemoveRequest() {
      this.$store.dispatch("removeRequest", {
        teamId: this.team.id,
        userId: this.selectedUserId
      })
      this.selectedUserId = null
      this.showRemoveRequestDialog = false
    },

    //confirm request
    handleConfirmRequest(userId) {
      this.selectedUserId = userId
      this.showConfirmRequestDialog = true
    },
    onCancelConfirmRequest() {
      this.selectedUserId = null
      this.showConfirmRequestDialog = false
    },
    onConfirmRequest() {
      this.$store.dispatch("confirmRequest", {
        teamId: this.team.id,
        userId: this.selectedUserId
      })
      this.selectedUserId = null
      this.showConfirmRequestDialog = false
    },

    cancelEdit() {
      this.showEditTeamDialog = false
      this.teamName = this.team.name
      this.isPublicTeam = this.team.teamType === 'public'
      this.image = ''
      this.coverPhoto = null
    },
    comfirmEdit() {
      this.showEditTeamDialog = false
      this.$store.dispatch('editTeam', {
        teamName: this.teamName,
        isPublicTeam: this.isPublicTeam,
        coverPhoto: this.coverPhoto
      })
    },
    onImageChange(e) {
      if (e.target.files.length) {
        const file = e.target.files[0];
        this.coverPhoto = file;
      }
    },
    reloadTeam() {
      this.$store.dispatch('getTeamInfo', {teamId: Number(this.$route.params.teamId)})
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
    'team.members'(newVal) {
      if (newVal && this.selectedUserId && this.showRemoveMemberDialog) {
        this.selectedUserId = null
        this.showRemoveMemberDialog = false
        this.$store.dispatch('getTeamInfo', {teamId: Number(this.$route.params.teamId)})
      }
    },
    'team'(newVal) {
      if (newVal.name) {
        this.teamName = newVal.name
        this.isPublicTeam = newVal.teamType === 'public'
      }
    }
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

.team-intro {
  display: flex;
  justify-content: space-between;
  padding-right: 40px;
  align-items: center;
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
.team-avatar {
  width: 150px;
  height: 150px;
  border-radius: 10px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
.team-edit-button {
  cursor: pointer;
}
</style>