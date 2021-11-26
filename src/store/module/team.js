import services from '../../services/team'

const team = {
  state: {
    teams: [],
    paginationNumber: 10,
    paginationOffset: 0,
    isLoaded: false,
    team: {},
    isTeamLoaded: false,
    error: null,
    loading: false
  },
  getters: {
    getTeamById: (state) => teamId => {
      return state.teams.find(t => t.id === teamId)
    }
  },
  mutations: {
    getAllTeams(state, { teams }) {
      state.isLoaded = true
      state.teams = teams
      state.loading = false
    },
    changePaginationOffset(state, { num }) {
      state.paginationOffset += num
    },
    setTeam(state, { team }) {
      state.isTeamLoaded = true
      let _team = state.teams.find(t => t.id === team.id)
      state.team = {
        ...team,
        host: {
          firstName: _team.host.firstName,
          lastName: _team.host.lastName
        },
        createdAt: _team.createdAt,
        updatedAt: _team.updatedAt
      }
      state.loading = false
    },
    delete(state, { teamId }) {
      let idx = state.teams.findIndex(t => t.id == teamId)
      if (idx >= 0) {
        state.teams.splice(idx, 1)
      }
    },
    setLoading(state) {
      state.loading = true
    }
  },
  actions: {
    async getAllTeams(context) {
      try {
        context.commit('setLoading')
        let response = await services.getAllTeams()
        let { teams } = response.data
        context.commit('getAllTeams', { teams })
      } catch (error) {
        console.log(error)
      }
    },
    async getTeamInfo(context, { teamId }) {
      try {
        context.commit('setLoading')
        let response = await services.getTeamInfo(teamId)
        let { team } = response.data
        //get invited users
        response = await services.getTeamInvitedUsers(teamId)
        let { invitedUsers } = response.data
        team.invitedUsers = invitedUsers
        //get members
        response = await services.getTeamMembers(teamId)
        let { members } = response.data
        team.members = members
        //get request users
        response = await services.getTeamRequestUsers(teamId)
        let { requestUsers } = response.data
        team.requestUsers = requestUsers
        //get meetings
        response = await services.getTeamMeeting(teamId)
        let { meetings } = response.data
        team.meetings = meetings
        context.commit('setTeam', { team })
      } catch (error) {
        console.log(error)
      }
    },
    async deleteTeam(context, { teamId }) {
      try {
        let response = await services.deleteTeam(teamId)
        if (response.status == 200) {
          context.commit('delete', { teamId })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async addTeam(context, { newTeam }) {
      try {
        let response = await services.addTeam(newTeam)
        if (response.status == 201) {
          response = await services.getAllTeams()
          let { teams } = response.data
          context.commit('getAllTeams', { teams })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
export default team;