import messageServices from '../../services/message'
import services from '../../services/team'

const team = {
  state: {
    teams: [],
    paginationNumber: 10,
    paginationOffset: 0,
    isLoaded: false,
    team: {
      members: [],
      requestUsers: [],
      invitedUsers: [],
      messages: []
    },
    isTeamLoaded: false,
    error: null,
    loading: false
  },
  getters: {
    getTeamById: (state) => teamId => {
      return state.teams.find(t => t.id === teamId)
    },
    getMessages(state) {
      return state.team.messages
    }
  },
  mutations: {
    getAllTeams(state, { teams }) {
      state.isLoaded = true
      state.teams = teams
      state.loading = false
    },
    changeTeamPaginationOffset(state, { num }) {
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
    removeMembers(state, { teamId, userId }) {
      if (teamId == state.team.id) {
        let idx = state.team.members.findIndex(m => m.id == userId)
        if (idx >= 0) {
          state.team.members.splice(idx, 1)
        }
      }
    },
    removeInvitation(state, { teamId, userId }) {
      if (teamId == state.team.id) {
        let idx = state.team.invitedUsers.findIndex(user => user.id == userId)
        if (idx >= 0) {
          state.team.invitedUsers.splice(idx, 1)
        }
      }
    },
    removeRequest(state, { teamId, userId }) {
      if (teamId == state.team.id) {
        let idx = state.team.requestUsers.findIndex(user => user.id === userId)
        if (idx >= 0) {
          state.team.requestUsers.splice(idx, 1)
        }
      }
    },
    confirmRequest(state, { teamId, userId }) {
      if (teamId == state.team.id) {
        let idx = state.team.requestUsers.findIndex(user => user.id === userId)
        if (idx >= 0) {
          let user = state.team.requestUsers[idx]
          state.team.requestUsers.splice(idx, 1)
          state.team.members.push(user)
        }
      }
    },
    setMessages(state, { teamId, messages }) {
      if (teamId == state.team.id) {
        state.team.messages = messages
      }
    },
    deleteMessage(state, { messageId }) {
      let idx = state.team.messages.findIndex(mess => mess.id == messageId)
      if (idx >= 0) {
        state.team.messages.splice(idx, 1)
        state.team.files = state.team.files.filter(file => file.messageId != messageId)
        state.team.images = state.team.images.filter(img => img.messageId != messageId)
      }
    },
    editTeam(state, { team }) {
      state.team = {
        ...state.team,
        ...team
      }
      let idx = state.teams.findIndex(t => t.id == state.team.id)
      if (idx >= 0) {
        let _term = { ...state.teams[idx] }
        for (const key of Object.keys(team)) {
          _term[key] = team[key]
        }
        state.teams.splice(idx, 1, _term)
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
        //get messages
        response = await services.getTeamMessages({ teamId })
        let { messages } = response.data
        team.messages = messages
        //get shared files
        response = await services.getTeamSharedFiles({ teamId })
        let { files } = response.data
        team.files = files
        //get shared images 
        response = await services.getTeamSharedMedia({ teamId })
        let { images } = response.data
        team.images = images
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
    },
    async removeMembers(context, { userId, teamId }) {
      try {
        await services.removeMembers({ userId, teamId })
        context.commit('removeMembers', { teamId, userId })
      } catch (error) {
        console.log(error)
      }
    },
    async cancelInvitation(context, { userId, teamId }) {
      try {
        await services.removeInvitation({ userId, teamId })
        context.commit('removeInvitation', { teamId, userId })
      } catch (error) {
        console.log(error)
      }
    },
    async removeRequest(context, { userId, teamId }) {
      try {
        await services.removeRequest({ teamId, userId })
        context.commit('removeRequest', { teamId, userId })
      } catch (error) {
        console.log(error)
      }
    },
    async confirmRequest(context, { userId, teamId }) {
      try {
        await services.confirmRequest({ userId, teamId })
        context.commit('confirmRequest', { userId, teamId })
      } catch (error) {
        console.log(error)
      }
    },
    async getTeamMessages(context, { teamId }) {
      try {
        let response = await services.getTeamMessages({ teamId })
        if (response.status == 200) {
          let { messages } = response.data
          context.commit('setMessages', { teamId, messages })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async editTeam(context, { teamName, isPublicTeam, coverPhoto }) {
      try {
        let teamId = context.state.team.id
        let response = await services.editTeam({ teamName, coverPhoto, isPublicTeam, teamId })
        let { team } = response.data
        context.commit('editTeam', { team })
      } catch (error) {
        console.log(error)
      }
    },
    async deleteTeamMessage(context, { messageId }) {
      try {
        let response = await messageServices.delete({ messageId })
        if (response.status == 200) {
          context.commit('deleteMessage', { messageId })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
export default team;