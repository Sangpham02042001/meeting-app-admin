<template>
  <div class="meetings-page">
    <div class="pagination-container"> 
      <md-button
        class="md-dense md-icon-button"
        @click="reloadMeetings">
        <md-tooltip md-direction="top">Reload</md-tooltip>
        <md-icon>autorenew</md-icon>
      </md-button>
      <md-button :disabled="isDisableDecs" @click="decreasePaginationOffset" class="md-dense md-icon-button"
        style="padding: 5px">
        <md-icon>
          arrow_back_ios
        </md-icon>
      </md-button>
      <md-button :disabled="isDisableInc" @click="increasePaginationOffset" class="md-dense md-icon-button"
        style="padding: 5px">
        <md-icon >
          arrow_forward_ios
        </md-icon>
      </md-button>
    </div>
    <md-table>
      <md-table-row>
        <md-table-head md-numeric>ID</md-table-head>
        <md-table-head>Host</md-table-head>
        <md-table-head>Status</md-table-head>
        <md-table-head>Created at</md-table-head>
        <md-table-head>Members</md-table-head>
        <md-table-head>Actions</md-table-head>
      </md-table-row>
      <md-table-row v-for="meeting in filteredMeetings" :key="meeting.id">
        <md-table-cell md-numeric>{{meeting.id}}</md-table-cell>
        <md-table-cell>{{meeting.host.firstName}} {{meeting.host.lastName}}</md-table-cell>
        <md-table-cell>{{meeting.active ? 'Active': 'Ended'}}</md-table-cell>
        <md-table-cell>{{getTime(meeting.createdAt)}}</md-table-cell>
        <md-table-cell>{{meeting.members.length}}</md-table-cell>
        <md-table-cell class="team-action">
          <router-link :to="'/meetings/' + meeting.id">
            <span class="material-icons">
              <md-tooltip md-direction="top">Edit</md-tooltip>
              edit
            </span>
          </router-link>
          <span class="material-icons">
            <md-tooltip md-direction="top">Delete</md-tooltip>
            delete
          </span>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import timeMixin from '../mixins/time'

export default {
  computed: {
    ...mapState({
      meetings: (state) => state.meeting.meetings,
      isMeetingsLoaded: (state) => state.meeting.isMeetingsLoaded,
      paginationOffset: (state) => state.meeting.paginationOffset,
      paginationNumber: (state) => state.meeting.paginationNumber
    }),
    isDisableInc() {
      return this.paginationOffset >= this.meetings.length 
        || this.paginationOffset + this.paginationNumber > this.meetings.length
    },
    isDisableDecs() {
      return this.paginationOffset <= 0
    },
    filteredMeetings() {
      return [...this.meetings].splice(this.paginationOffset, this.paginationNumber)
    }
  },
  mounted() {
    if (!this.isMeetingsLoaded) {
      this.$store.dispatch('getAllMeetings')
    }
  },
  methods: {
    increasePaginationOffset() {
      !this.isDisableInc && this.$store.commit('changeMeetingPaginationOffset', {num: this.paginationNumber})
    },
    decreasePaginationOffset() {
      !this.isDisableDecs && this.$store.commit('changeMeetingPaginationOffset', {num: -this.paginationNumber})
    },
    reloadMeetings() {
      this.$store.dispatch('getAllMeetings')
    },
  },
  mixins: [timeMixin]
};
</script>

<style lang="scss" scoped>
.pagination-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .md-button {
    margin-right: 10px;
  }
  .md-button .md-ripple {
    padding: 8px !important;
  }
}
</style>
