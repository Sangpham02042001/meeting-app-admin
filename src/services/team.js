import { axiosInstance as axiosAuth } from '../utils'

const teamServices = {
  getAllTeams: () => {
    return axiosAuth.get('/api/teams')
  }
}

export default teamServices;