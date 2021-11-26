import { axiosAuth } from '../utils'

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
  },
  deleteTeam: (teamId) => {
    return axiosAuth.delete(`/api/teams/${teamId}`)
  },
  addTeam: (teamName, hostId, coverPhoto, teamType) => {
    let formData = new FormData()
    formData.append('name', teamName)
    formData.append('hostId', hostId)
    formData.append('coverPhoto', coverPhoto)
    formData.append('teamType', teamType)
    return axiosAuth.post('/api/teams', formData)
  }
}

export default teamServices;