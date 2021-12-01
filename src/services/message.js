import { axiosAuth } from '../utils'

const messageServices = {
  delete: ({ messageId }) => {
    return axiosAuth.delete(`/api/messages/${messageId}`)
  },
  getMessages: ({ offset, num }) => {
    return axiosAuth.get(`/api/messages?offset=${offset}&num=${num}`)
  },
  editMessage: ({ messageId, content }) => {
    return axiosAuth.put(`/api/messages/${messageId}`, {
      content
    })
  }
}

export default messageServices;