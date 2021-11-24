<template>
  <div class="teams-page">
    <div class="search-team-container"> 
      <search-by-name :options="teamsName" @handleChange="searchByName" title="Team Name"/>
    </div>
    <div class="pagination-container"> 
      <md-button :disabled="isDisableDecs" @click="decreasePaginationOffset" class="md-icon-button"
        style="padding: 5px">
        <md-icon>
          arrow_back_ios
        </md-icon>
      </md-button>
      <md-button :disabled="isDisableInc" @click="increasePaginationOffset" class="md-icon-button"
        style="padding: 5px">
        <md-icon >
          arrow_forward_ios
        </md-icon>
      </md-button>
    </div>
    <md-table>
      <md-table-row>
        <md-table-head md-numeric>ID</md-table-head>
        <md-table-head>Name</md-table-head>
        <md-table-head>Host</md-table-head>
        <md-table-head>Team type</md-table-head>
        <md-table-head>Created at</md-table-head>
        <md-table-head>Members</md-table-head>
        <md-table-head>Meetings</md-table-head>
        <md-table-head>Actions</md-table-head>
      </md-table-row>

      <md-table-row v-for="team in filteredTeams" :key="team.id">
        <md-table-cell md-numeric>{{team.id}}</md-table-cell>
        <md-table-cell>
          <router-link :to="'/teams/' + team.id">
            {{team.name}}
          </router-link>
        </md-table-cell>
        <md-table-cell>{{team.host.firstName}} {{team.host.lastName}}</md-table-cell>
        <md-table-cell>{{team.teamType}} team</md-table-cell>
        <md-table-cell>{{getTime(team.createdAt)}}</md-table-cell>
        <md-table-cell>{{team.members.length}}</md-table-cell>
        <md-table-cell>{{team.meetings.length}}</md-table-cell>
        <md-table-cell class="team-action">
          <span class="material-icons">
            <md-tooltip md-direction="top">Edit</md-tooltip>
            edit
          </span>
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
import SearchByName from '../components/SearchByName.vue'

export default {
  props: {
    dataBackgroundColor: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapState({
      teams: (state) => state.team.teams,
      isTeamLoaded: (state) => state.team.isLoaded,
      paginationOffset: (state) => state.team.paginationOffset,
      paginationNumber: (state) => state.team.paginationNumber
    }),
    filteredTeams() {
      if (!this.searchTeamName) {
        return [...this.teams].splice(this.paginationOffset, this.paginationNumber)
      } else {
        return this.teams.filter(team => team.name.toLowerCase().includes(this.searchTeamName.toLowerCase()))
      }
    },
    teamsName() {
      return this.filteredTeams.map(team => team.name)
    },
    isDisableInc() {
      return this.paginationOffset >= this.teams.length 
        || this.paginationOffset + this.paginationNumber > this.teams.length
    },
    isDisableDecs() {
      return this.paginationOffset <= 0
    }
  },
  data() {
    return {
      searchTeamName: ''
    }
  },
  mounted() {
    if (!this.isTeamLoaded) {
      this.$store.dispatch('getAllTeams')
    }
  },
  methods: {
    searchByName({name}) {
      this.searchTeamName = name
    },
    increasePaginationOffset() {
      !this.isDisableInc && this.$store.commit('changePaginationOffset', {num: this.paginationNumber})
    },
    decreasePaginationOffset() {
      !this.isDisableDecs && this.$store.commit('changePaginationOffset', {num: -this.paginationNumber})
    },
  },
  components: {
    'search-by-name': SearchByName
  },
  mixins: [timeMixin]
};
</script>

<style lang="scss" scoped>
.teams-page {
  padding: 0 15px;
  min-height: 80vh;
}
.md-table-cell {
  text-transform: capitalize;
}
.md-table-head-label {
  font-weight: 600 !important;
}
.search-team-container {
  width: 50%;
  margin: auto;
}
.team-action {
  span {
    cursor: pointer;
  }
}
.md-field{
  margin-bottom: 0 !important;
}
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  .md-button .md-ripple {
    padding: 8px !important;
  }
}
</style>
