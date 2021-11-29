import meetingServices from "../../services/meeting";
import messageServices from "../../services/message";

const meeting = {
  state: {
    meetings: [],
    isMeetingsLoaded: false,
    paginationNumber: 15,
    paginationOffset: 0,
    meeting: null,
    isMeetingLoaded: false
  },
  getters: {

  },
  mutations: {
    setMeetings(state, { meetings }) {
      state.meetings = meetings
      state.isMeetingsLoaded = true
    },
    setMeeting(state, { meeting }) {
      state.meeting = meeting
      state.isMeetingLoaded = true
    },
    deleteMessage(state, { messageId }) {
      let idx = state.meeting.messages.findIndex(mess => mess.id == messageId)
      if (idx >= 0) {
        state.meeting.messages.splice(idx, 1)
      }
    },
    delete(state, { meetingId }) {
      let idx = state.meetings.findIndex(t => t.id == meetingId)
      if (idx >= 0) {
        state.meetings.splice(idx, 1)
      }
    },
    changeMeetingPaginationOffset(state, { num }) {
      state.paginationOffset += num
    },
  },
  actions: {
    async getAllMeetings(context) {
      try {
        let response = await meetingServices.getAllMeetings()
        let { meetings } = response.data
        context.commit('setMeetings', { meetings })
      } catch (error) {
        console.log(error)
      }
    },
    async getMeetingById(context, { meetingId }) {
      try {
        let meeting
        let response = await meetingServices.getMeetingInfo({ meetingId })
        meeting = response.data.meeting[0]
        response = await meetingServices.getMeetingMessages({ meetingId })
        meeting.messages = response.data.messages
        context.commit('setMeeting', { meeting })
      } catch (error) {
        console.log(error)
      }
    },
    async deleteMeetingMessage(context, { messageId }) {
      try {
        let response = await messageServices.delete({ messageId })
        if (response.status == 200) {
          context.commit('deleteMessage', { messageId })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async deleteMeeting(context, { meetingId }) {
      try {
        let response = await meetingServices.deleteMeeting({ meetingId })
        if (response.status == 200) {
          context.commit('delete', { meetingId })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}

export default meeting;