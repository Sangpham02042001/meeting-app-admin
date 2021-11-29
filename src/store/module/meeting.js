import meetingServices from "../../services/meeting";

const meeting = {
  state: {
    meetings: [],
    isMeetingsLoaded: false,
    paginationNumber: 15,
    paginationOffset: 0,
  },
  getters: {

  },
  mutations: {
    setMeetings(state, { meetings }) {
      state.meetings = meetings
      state.isMeetingsLoaded = true
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
    }
  }
}

export default meeting;