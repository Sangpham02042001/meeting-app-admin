import messageServices from "../../services/message";

const message = {
  state: {
    messages: [],
    isMessageLoaded: false,
    offset: 0,
    num: 20,
    numOfMessages: 0
  },
  getters: {

  },
  mutations: {
    setMessages(state, { messages, numOfMessages }) {
      state.messages = messages
      state.isMessageLoaded = true
      state.numOfMessages = numOfMessages
    },
    changeOffset(state, { num }) {
      state.offset += num
    },
    setMessage(state, { messageId, content }) {
      let idx = state.messages.findIndex(m => m.id == messageId)
      if (idx >= 0) {
        state.messages.splice(idx, 1, {
          ...state.messages[idx],
          content
        })
      }
    },
    deleteMessage(state, { messageId }) {
      let idx = state.messages.findIndex(m => m.id == messageId)
      if (idx >= 0) {
        state.messages.splice(idx, 1)
      }
    }
  },
  actions: {
    async getMessages(context) {
      try {
        let response = await messageServices.getMessages({
          offset: context.state.offset,
          num: context.state.num
        })
        let { messages, numOfMessages } = response.data
        context.commit('setMessages', { messages, numOfMessages })
      } catch (error) {
        console.log(error)
      }
    },
    async editMessage(context, { messageId, content }) {
      try {
        await messageServices.editMessage({ messageId, content })
        context.commit('setMessage', { messageId, content })
      } catch (error) {
        console.log(error)
      }
    },
    async deleteMessage(contenxt, { messageId }) {
      try {
        await messageServices.delete({ messageId })
        contenxt.commit('deleteMessage', { messageId })
      } catch (error) {
        console.log(error)
      }
    }
  }
}

export default message;