<template>
  <div class="feedbacks-page">
    <div class="pagination-container">
      <md-button class="md-dense md-icon-button" @click="reloadFeedbacks">
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
        <md-table-head>Created By</md-table-head>
        <md-table-head>Created at</md-table-head>
        <md-table-head>Updated at</md-table-head>
        <md-table-head>Actions</md-table-head>
      </md-table-row>

      <md-table-row v-for="feedback in filteredFeedbacks" :key="feedback.id">
        <md-table-cell md-numeric>{{feedback.id}}</md-table-cell>
        <md-table-cell>{{feedback.content}}</md-table-cell>
        <md-table-cell>{{feedback.User.firstName + ' ' + feedback.User.lastName}}</md-table-cell>
        <md-table-cell>{{getTime(feedback.createdAt)}}</md-table-cell>
        <md-table-cell>{{getTime(feedback.updatedAt)}}</md-table-cell>
         <md-table-cell>
          <span class="material-icons" @click="handleEdit(feedback.id, feedback.content)">
            <md-tooltip md-direction="top">Edit</md-tooltip>
            edit
          </span>
          <span class="material-icons" @click="handleDelete(feedback.id)">
            <md-tooltip md-direction="top">Delete</md-tooltip>
            delete
          </span>
        </md-table-cell>
      </md-table-row>
    </md-table>

    <md-dialog :md-active.sync="showEditDialog">
      <md-dialog-title>Edit feedback</md-dialog-title>
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
      md-title="Delete this feedback?"
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
  name: 'Feedbacks',
  computed: {
    ...mapState({
      feedbacks: state => state.feedback.feedbacks,
      feedbackLoaded: state => state.feedback.feedbackLoaded,
      paginationNumber: state => state.feedback.paginationNumber,
      paginationOffset: state => state.feedback.paginationOffset,
    }),
    filteredFeedbacks() {
      return [...this.feedbacks].splice(this.paginationOffset, this.paginationNumber)
    },
    isDisableInc() {
      return (
        this.paginationOffset >= this.feedbacks.length ||
        this.paginationOffset + this.paginationNumber > this.feedbacks.length
      );
    },
    isDisableDecs() {
      return this.paginationOffset <= 0;
    },
  },
  methods: {
    reloadFeedbacks() {
      this.$store.dispatch('getFeedbacks')
    },
    increasePaginationOffset() {
      !this.isDisableInc && this.$store.commit('changeFeedbackPaginationOffset', {num: this.paginationNumber})
    },
    decreasePaginationOffset() {
      !this.isDisableDecs && this.$store.commit('changeFeedbackPaginationOffset', {num: -this.paginationNumber})
    },
    handleEdit(id, content) {
      this.id = id
      this.content = content
      this.showEditDialog = true
    },
    cancelEdit() {
      this.id = null
      this.content = ''
      this.showEditDialog = false
    },
    confirmEdit() {
      this.$store.dispatch('updateFeedback', {
        feedbackId: this.id,
        content: this.content
      })
      this.id = null
      this.content = ''
      this.showEditDialog = false
    },
    handleDelete(id) {
      this.id = id
      this.showDeleteDialog = true
    },
    cancelDelete() {
      this.id = null
      this.showDeleteDialog = false
    },
    confirmDelete() {
      this.$store.dispatch('deleteFeedback', {feedbackId: this.id})
      this.id = null
      this.showDeleteDialog = false
    }
  },
  data() {
    return {
      id: null,
      content: '',
      showEditDialog: false,
      showDeleteDialog: false,
    }
  },
  mounted() {
    if (!this.feedbackLoaded) {
      this.$store.dispatch('getFeedbacks')
    }
  },
  mixins: [timeMixin],
}
</script>

<style lang="scss" scoped>
.feedbacks-page {
  padding: 20px;
}
span {
  cursor: pointer;
}
</style>