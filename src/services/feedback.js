import { axiosAuth } from '../utils'

const feedbackServices = {
  get: () => {
    return axiosAuth.get('/admin/api/feedbacks')
  },
  updateFeedback: ({ feedbackId, content }) => {
    return axiosAuth.put(`/admin/api/feedbacks/${feedbackId}`, { content })
  },
  deleteFeedback: ({ feedbackId }) => {
    return axiosAuth.delete(`/admin/api/feedbacks/${feedbackId}`)
  }
}

export default feedbackServices