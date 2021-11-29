import { axiosAuth } from '../utils'

const meetingServices = {
  getAllMeetings: () => {
    return axiosAuth.get('/api/meetings')
  }
}

export default meetingServices