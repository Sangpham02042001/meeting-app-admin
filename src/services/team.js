import { axiosInstance as axiosAuth } from '../utils'

const teamServices = {
  getAllTeams: () => {
    return axiosAuth.get('/api/teams')
  },
  getTeamInfo: (teamId) => {
    return axiosAuth.get(`/api/teams/${teamId}`)
  },
  getTeamMembers: (teamId) => {
    return axiosAuth.get(`/api/teams/${teamId}/members`)
  },
  getTeamRequestUsers: (teamId) => {
    return axiosAuth.get(`/api/teams/${teamId}/requestusers`)
  },
  getTeamInvitedUsers: (teamId) => {
    return axiosAuth.get(`/api/teams/${teamId}/invited-users`)
  },
  getTeamMeeting: (teamId) => {
    return axiosAuth.get(`/api/teams/${teamId}/meetings`)
  }
}

export default teamServices;