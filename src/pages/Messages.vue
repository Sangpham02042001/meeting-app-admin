<template>
  <div class="messages-page">
    <div class="pagination-container">
      <md-button class="md-dense md-icon-button" @click="reloadMessages">
        <md-tooltip md-direction="top">Reload</md-tooltip>
        <md-icon>autorenew</md-icon>
      </md-button>
      <md-button
        :disabled="isDisableDesc"
        @click="decreaseOffset"
        class="md-dense md-icon-button"
        style="padding: 5px"
      >
        <md-icon> arrow_back_ios </md-icon>
      </md-button>
      <md-button
        :disabled="isDisableInc"
        @click="increaseOffset"
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
        <md-table-head>Created By</md-table-head>
        <md-table-head>Files</md-table-head>
        <md-table-head>Images</md-table-head>
        <md-table-head>Created at</md-table-head>
        <md-table-head md-numeric>TeamID</md-table-head>
        <md-table-head md-numeric>ConversationID</md-table-head>
        <md-table-head md-numeric>MeetingID</md-table-head>
        <md-table-head>Actions</md-table-head>
      </md-table-row>
      <md-table-row v-for="message in messages" :key="message.id">
        <md-table-head md-numeric>{{message.id}}</md-table-head>
        <md-table-head>{{message.content}}</md-table-head>
        <md-table-head>{{message.user.firstName + ' ' + message.user.lastName}}</md-table-head>
        <md-table-head>{{message['Media'].filter(m => m.type == 'file').length}}</md-table-head>
        <md-table-head>{{message['Media'].filter(m => m.type == 'image').length}}</md-table-head>
        <md-table-head>{{ getTime(message.createdAt) }}</md-table-head>
        <md-table-head md-numeric>{{message.teamId}}</md-table-head>
        <md-table-head md-numeric>{{message.conversationId}}</md-table-head>
        <md-table-head md-numeric>{{message.meetingId}}</md-table-head>
         <md-table-cell>
          <span class="material-icons" @click="handleEdit(message.id, message.content)">
            <md-tooltip md-direction="top" >Edit</md-tooltip>
            edit
          </span>
          <span class="material-icons" @click="handleDelete(message.id)">
            <md-tooltip md-direction="top">Delete</md-tooltip>
            delete
          </span>
        </md-table-cell>
      </md-table-row>
    </md-table>

    <md-dialog :md-active.sync="showEditDialog">
      <md-dialog-title>Edit message</md-dialog-title>
      <md-dialog-content>
        <md-field>
          <label>Content</label>
          <md-input v-model="content"></md-input>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="cancelEdit">Cancel</md-button>
        <md-button class="md-primary" @click="confirmEdit">Save</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog-confirm
      :md-active.sync="showDeleteDialog"
      md-title="Delete this message?"
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
  name: "Messages",
  computed: {
    ...mapState({
      messages: state => state.message.messages,
      isMessageLoaded: state => state.message.isMessageLoaded,
      offset: state => state.message.offset,
      num: state => state.message.num,
      numOfMessages: state => state.message.numOfMessages,
    }),
    isDisableDesc() {
      return this.offset <= 0
    },
    isDisableInc() {
      return this.offset >= this.numOfMessages || ((this.offset + this.num) > this.numOfMessages)
    }
  },
  methods: {
    increaseOffset() {
      this.$store.commit('changeOffset', {num: this.num})
    },
    decreaseOffset() {
      this.$store.commit('changeOffset', {num: -this.num})
    },
    reloadMessages() {
      this.$store.dispatch('getMessages')
    },
    handleEdit(messageId, content) {
      this.selectedMessage =messageId
      this.showEditDialog = true
      this.content = content
    },
    cancelEdit() {
      this.selectedMessage = null
      this.showEditDialog = false
      this.content = ''
    },
    confirmEdit() {
      this.$store.dispatch('editMessage', {messageId: this.selectedMessage, content: this.content})
      this.selectedMessage = null
      this.showEditDialog = false
      this.content = ''
    },
    handleDelete(messageId) {
      this.showDeleteDialog = true
      this.selectedMessage = messageId
    },
    cancelDelete() {
      this.showDeleteDialog = false
      this.selectedMessage = null
    },
    confirmDelete() {
      this.$store.dispatch('deleteMessage', {messageId: this.selectedMessage})
      this.selectedMessage = null
      this.showDeleteDialog = false
    }
  }, 
  watch: {
    offset() {
      this.$store.dispatch('getMessages')
    }
  },
  data() {
    return {
      showEditDialog: false,
      selectedMessage: null,
      showDeleteDialog: false,
      content: ''
    }
  },
  mounted() {
    this.$store.dispatch('getMessages')
  },
  mixins: [timeMixin],
}
</script>

<style lang="scss" scoped>
.messages-page {
  padding: 15px 30px;
}
span {
  cursor: pointer;
}
</style>