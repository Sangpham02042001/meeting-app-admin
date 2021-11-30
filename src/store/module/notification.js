import notificationService from "../../services/notification";

const notification = {
  state: {
    notifications: [],
    isNotificationsLoaded: false,
    paginationNumber: 15,
    paginationOffset: 0,
  },
  getters: {

  },
  mutations: {
    setNofications(state, { notifications }) {
      state.notifications = notifications
      state.isNotificationsLoaded = true
    },
    changeNotiPaginationOffset(state, { num }) {
      state.paginationOffset += num
    },
    setNoti(state, { notiId, content, isRead }) {
      let idx = state.notifications.findIndex(noti => noti.id == notiId)
      if (idx >= 0) {
        state.notifications.splice(idx, 1, {
          ...state.notifications[idx],
          content, isRead
        })
      }
    },
    deleteNoti(state, { notiId }) {
      let idx = state.notifications.findIndex(noti => noti.id == notiId)
      if (idx >= 0) {
        state.notifications.splice(idx, 1)
      }
    }
  },
  actions: {
    async getAllNotifications(context) {
      try {
        let response = await notificationService.getAll()
        let { notifications } = response.data
        context.commit('setNofications', { notifications })
      } catch (error) {
        console.log(error)
      }
    },
    async updateNoti(context, { notiId, content, isRead }) {
      try {
        let response = await notificationService.updateNoti({ notiId, content, isRead })
        if (response.status == 200) {
          context.commit('setNoti', { notiId, content, isRead })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async deleteNoti(context, { notiId }) {
      try {
        let response = await notificationService.deleteNoti({ notiId })
        if (response.status == 200) {
          context.commit('deleteNoti', { notiId })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}

export default notification;