<template>
  <div class="teams-page">
    <div class="search-team-container"> 
      <search-by-name :options="teamsName" @handleChange="searchByName" title="Team Name"/>
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
      isTeamLoaded: (state) => state.team.isLoaded
    }),
    filteredTeams() {
      if (!this.searchTeamName) {
        return this.teams
      } else {
        return this.teams.filter(team => team.name.toLowerCase().includes(this.searchTeamName.toLowerCase()))
      }
    },
    teamsName() {
      return this.filteredTeams.map(team => team.name)
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
    }
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
</style>
