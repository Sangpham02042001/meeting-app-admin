<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-button
          class="md-dense md-icon-button"
          style="margin-right: 10px"
          @click="reloadPage"
        >
          <md-tooltip md-direction="top">Reload</md-tooltip>
          <md-icon>autorenew</md-icon>
        </md-button>
        <md-button
          class="md-dense md-icon-button"
          @click="userAdd.isAdd = true"
        >
          <md-tooltip md-direction="top">Add</md-tooltip>
          <md-icon>add</md-icon>
        </md-button>
        <md-card>
          <md-card-content>
            <user-table table-header-color="green"></user-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <md-dialog :md-active.sync="userAdd.isAdd">
      <md-dialog-title>Add User</md-dialog-title>
      <md-dialog-content>
        <div class="dialog-content">
            <md-field>
              <label>First Name</label>
              <md-input v-model="userAdd.firstName"></md-input>
            </md-field>
            <md-field>
              <label>Last Name</label>
              <md-input v-model="userAdd.lastName"></md-input>
            </md-field>
            <md-field>
              <label>Email</label>
              <md-input v-model="userAdd.email"></md-input>
            </md-field>
            <md-field>
              <label>Password</label>
              <md-input v-model="userAdd.password"></md-input>
            </md-field>
        </div>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="userAdd.isAdd = false"
          >Close</md-button
        >
        <md-button class="md-primary" @click="confirmAdd"> Add </md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { UserTable } from "@/components";

export default {
  components: {
    UserTable,
  },

  data() {
    return {
      userAdd: {
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        isAdd: false,
      },
    };
  },

  created() {
    this.$store.dispatch("getAllUsers");
    this.$store.commit("setLoadingUser", { isLoading: true });
  },
  methods: {
    reloadPage() {
      this.$store.dispatch("getAllUsers");
      this.$store.commit("setLoadingUser", { isLoading: true });
    },
    confirmAdd() {
      this.$store.dispatch("addUser", {
        firstName: this.userAdd.firstName,
        lastName: this.userAdd.lastName,
        email: this.userAdd.email,
        password: this.userAdd.password,
      });
      this.userAdd.firstName = null;
      this.userAdd.lastName = null;
      this.userAdd.email = null;
      this.userAdd.password = null;
      this.userAdd.isAdd = false;
    },
  },
};
</script>
