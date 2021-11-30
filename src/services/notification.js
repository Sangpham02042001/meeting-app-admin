import { axiosAuth } from '../utils'

const notificationService = {
  getAll: () => {
    return axiosAuth.get('/api/notifications')
  },
  updateNoti: ({ notiId, content, isRead }) => {
    return axiosAuth.put(`/api/notifications/${notiId}`, {
      content, isRead
    })
  },
  deleteNoti: ({ notiId }) => {
    return axiosAuth.delete(`/api/notifications/${notiId}`)
  }
}

export default notificationService