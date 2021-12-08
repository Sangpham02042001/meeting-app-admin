import feedbackServices from "../../services/feedback";

const feedback = {
  state: {
    feedbackLoaded: false,
    feedbacks: [],
    paginationNumber: 15,
    paginationOffset: 0,
  },
  getters: {

  },
  mutations: {
    setFeedbacks(state, { feedbacks }) {
      state.feedbacks = feedbacks
      state.feedbackLoaded = true
    },
    updateFeedback(state, { feedbackId, content }) {
      let idx = state.feedbacks.findIndex(f => f.id == feedbackId)
      if (idx >= 0) {
        state.feedbacks.splice(idx, 1, {
          ...state.feedbacks[idx],
          content
        })
      }
    },
    deleteFeedback(state, { feedbackId }) {
      let idx = state.feedbacks.findIndex(f => f.id == feedbackId)
      if (idx >= 0) {
        state.feedbacks.splice(idx, 1)
      }
    }
  },
  actions: {
    async getFeedbacks(context) {
      try {
        let response = await feedbackServices.get()
        let { feedbacks } = response.data
        context.commit('setFeedbacks', { feedbacks })
      } catch (error) {
        console.log(error)
      }
    },
    async updateFeedback(context, { feedbackId, content }) {
      try {
        let response = await feedbackServices.updateFeedback({ feedbackId, content })
        if (response.status == 200) {
          context.commit('updateFeedback', { feedbackId, content })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async deleteFeedback(context, { feedbackId }) {
      try {
        let response = await feedbackServices.deleteFeedback({ feedbackId })
        if (response.status == 200) {
          context.commit('deleteFeedback', { feedbackId })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}

export default feedback;