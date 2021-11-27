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
  addTeam: ({ teamName, hostId, coverPhoto, isPublicTeam }) => {
    console.log(coverPhoto)
    let teamType = isPublicTeam ? 'public' : 'private'
    let formData = new FormData()
    formData.append('name', teamName)
    formData.append('hostId', hostId)
    formData.append('coverPhoto', coverPhoto)
    formData.append('teamType', teamType)
    return axiosAuth.post('/api/teams', formData)
  },
  removeMembers: ({ teamId, userId }) => {
    return axiosAuth.put(`/api/teams/${teamId}/remove-members`, {
      users: [userId]
    })
  },
  inviteUsers: ({ teamId, userId }) => {
    return axiosAuth.post(`/api/teams/${teamId}/users`, {
      users: [userId]
    })
  },
  removeInvitation: ({ teamId, userId }) => {
    return axiosAuth.put(`/api/teams/${teamId}/users`, {
      users: [userId]
    })
  },
  confirmRequest: ({ teamId, userId }) => {
    return axiosAuth.put(`/api/teams/${teamId}/confirm-requests`, {
      users: [userId]
    })
  },
  removeRequest: ({ teamId, userId }) => {
    return axiosAuth.put(`/api/teams/${teamId}/remove-requests`, {
      users: [userId]
    })
  },
  getTeamMessages: ({ teamId }) => {
    return axiosAuth.get(`/api/teams/${teamId}/messages`)
  }
}

export default teamServices;