import { axiosAuth } from '../utils'

const messageServices = {
  delete: ({ messageId }) => {
    return axiosAuth.delete(`/api/messages/${messageId}`)
  }
}

export default messageServices;