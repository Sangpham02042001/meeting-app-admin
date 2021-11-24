import services from '../../services/team'

const team = {
  state: {
    teams: [],
    isLoaded: false,
    error: null
  },
  getters: {
    getTeamById: (state) => teamId => {
      return state.teams.find(t => t.id === teamId)
    }
  },
  mutations: {
    getAllTeams(state, { teams }) {
      state.teams = teams
    }
  },
  actions: {
    async getAllTeams(context) {
      try {
        let response = await services.getAllTeams()
        let { teams } = response.data
        context.commit('getAllTeams', { teams })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
export default team;