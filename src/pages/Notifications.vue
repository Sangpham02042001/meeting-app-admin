<template>
  <div class="notifications-page">
    <div class="pagination-container">
      <md-button class="md-dense md-icon-button" @click="reloadNotifications">
        <md-tooltip md-direction="top">Reload</md-tooltip>
        <md-icon>autorenew</md-icon>
      </md-button>
      <md-button
        :disabled="isDisableDecs"
        @click="decreasePaginationOffset"
        class="md-dense md-icon-button"
        style="padding: 5px"
      >
        <md-icon> arrow_back_ios </md-icon>
      </md-button>
      <md-button
        :disabled="isDisableInc"
        @click="increasePaginationOffset"
        class="md-dense md-icon-button"
        style="padding: 5px"
      >
        <md-icon> arrow_forward_ios </md-icon>
      </md-button>
    </div>
    <md-table>
      <md-table-row>
        <md-table-head md-numeric>ID</md-table-head>
        <md-table-head>Content</md-table-head>
        <md-table-head>Relative Link</md-table-head>
        <md-table-head>Created By</md-table-head>
        <md-table-head>Receive User</md-table-head>
        <!-- <md-table-head>Team</md-table-head> -->
        <md-table-head>Created at</md-table-head>
        <md-table-head>Is Read</md-table-head>
        <md-table-head>Actions</md-table-head>
      </md-table-row>

      <md-table-row v-for="noti in filteredNotifications" :key="noti.id">
        <md-table-cell md-numeric>{{noti.id}}</md-table-cell>
        <md-table-cell>{{noti.content}}</md-table-cell>
        <md-table-cell>{{noti.relativeLink}}</md-table-cell>
        <md-table-cell>{{noti.created.firstName + ' ' + noti.created.lastName}}</md-table-cell>
        <md-table-cell>{{noti.user.firstName + ' ' + noti.user.lastName}}</md-table-cell>
        <md-table-cell>{{ getTime(noti.createdAt) }}</md-table-cell>
        <md-table-cell>{{ noti.isRead }}</md-table-cell>
        <md-table-cell>
          <span class="material-icons" @click="handleEdit(noti.id, noti.content, noti.isRead)">
            <md-tooltip md-direction="top">Edit</md-tooltip>
            edit
          </span>
          <span class="material-icons" @click="handleDelete(noti.id)">
            <md-tooltip md-direction="top">Delete</md-tooltip>
            delete
          </span>
        </md-table-cell>
      </md-table-row>
    </md-table>

    <md-dialog :md-active.sync="showEditDialog">
      <md-dialog-title>Edit notification</md-dialog-title>
      <md-dialog-content>
        <md-field>
          <label>Content</label>
          <md-input v-model="notiContent"></md-input>
        </md-field>
        <md-checkbox v-model="isRead">Is Read</md-checkbox>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="cancelEdit">Cancel</md-button>
        <md-button class="md-primary" @click="confirmEdit">Save</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog-confirm
      :md-active.sync="showDeleteDialog"
      md-title="Delete this notification?"
      md-confirm-text="Agree"
      md-cancel-text="Disagree"
      @md-cancel="cancelDelete"
      @md-confirm="confirmDelete"
    />
  </div>
</template>

<script>
import {mapState} from 'vuex'
import timeMixin from "../mixins/time";

export default {
  name: 'Notifications',
  computed: {
    ...mapState({
      notifications: state => state.notification.notifications,
      isNotificationsLoaded: state => state.notification.isNotificationsLoaded,
      paginationNumber: state => state.notification.paginationNumber,
      paginationOffset: state => state.notification.paginationOffset
    }),
    filteredNotifications() {
      return [...this.notifications].splice(this.paginationOffset, this.paginationNumber)
    },
    isDisableInc() {
      return (
        this.paginationOffset >= this.notifications.length ||
        this.paginationOffset + this.paginationNumber > this.notifications.length
      );
    },
    isDisableDecs() {
      return this.paginationOffset <= 0;
    },
  },
  methods: {
    reloadNotifications() {
      this.$store.dispatch('getAllNotifications')
    },
    increasePaginationOffset() {
      !this.isDisableInc && this.$store.commit('changeNotiPaginationOffset', {num: this.paginationNumber})
    },
    decreasePaginationOffset() {
      !this.isDisableDecs && this.$store.commit('changeNotiPaginationOffset', {num: -this.paginationNumber})
    },
    handleEdit(notiId, content, isRead) {
      this.selectedNoti = notiId
      this.showEditDialog = true
      this.notiContent = content
      this.isRead = isRead
    },
    cancelEdit() {
      this.selectedNoti = null
      this.showEditDialog = false
      this.notiContent = ''
      this.isRead = false
    },
    confirmEdit() {
      this.$store.dispatch('updateNoti', {
        notiId: this.selectedNoti,
        content: this.notiContent,
        isRead: this.isRead
      })
      this.selectedNoti = null
      this.showEditDialog = false
      this.notiContent = ''
      this.isRead = false
    },
    handleDelete(notiId) {
      this.selectedNoti = notiId
      this.showDeleteDialog = true
    },
    cancelDelete() {
      this.selectedNoti = null
      this.showDeleteDialog = false
    },
    confirmDelete() {
      this.$store.dispatch('deleteNoti', {notiId: this.selectedNoti})
      this.selectedNoti = null
      this.showDeleteDialog = false
    }
  },
  data() {
    return {
      selectedNoti: null,
      showEditDialog: false,
      showDeleteDialog: false,
      notiContent: '',
      isRead: false,
    }
  },
  mounted() {
    if(!this.isNotificationsLoaded) {
      this.$store.dispatch('getAllNotifications')
    }
  },
  mixins: [timeMixin],
}
</script>

<style lang="scss" scoped>
.notifications-page {
  padding: 15px;
}
span {
  cursor: pointer;
}
</style>