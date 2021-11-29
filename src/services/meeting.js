import { axiosAuth } from '../utils'

const meetingServices = {
  getAllMeetings: () => {
    return axiosAuth.get('/api/meetings')
  },
  getMeetingInfo: ({ meetingId }) => {
    return axiosAuth.get(`/api/meetings/${meetingId}`)
  },
  getMeetingMessages: ({ meetingId }) => {
    return axiosAuth.get(`/api/meetings/${meetingId}/messages`)
  },
  deleteMeeting: ({ meetingId }) => {
    return axiosAuth.delete(`/api/meetings/${meetingId}`)
  }
}

export default meetingServices