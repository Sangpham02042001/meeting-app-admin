<template>
  <div class="user-table">
    <md-progress-spinner
      md-mode="indeterminate"
      v-if="isLoading"
    ></md-progress-spinner>
    <md-table
      v-model="searched"
      :table-header-color="tableHeaderColor"
      md-sort="id"
      md-sort-order="asc"
      v-else
    >
      <md-table-toolbar>
        <h1 class="md-title">Users</h1>
        <md-field md-clearable class="md-toolbar-section-end">
          <md-input
            placeholder="Search by name..."
            v-model="search"
            @input="searchOnTable"
          />
        </md-field>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="ID" md-sort-by="id">{{
          item.id
        }}</md-table-cell>
        <md-table-cell md-label="Name">{{
          item.firstName.concat(" ", item.lastName)
        }}</md-table-cell>
        <md-table-cell md-label="Email">{{ item.email }}</md-table-cell>
        <md-table-cell md-label="Password">{{
          item.hash_password
        }}</md-table-cell>
        <md-table-cell md-label="Status">{{ item.status }}</md-table-cell>
        <md-table-cell md-label="Recently Login">{{
          getTime(item.updatedAt)
        }}</md-table-cell>
        <md-table-cell md-label="Role">{{ item.role }}</md-table-cell>
        <md-table-cell md-label="Created At">{{
          getTime(item.createdAt)
        }}</md-table-cell>
        <md-table-cell>
          <md-menu
            md-direction="bottom-start"
            :md-offset-x="-30"
            md-size="small"
            md-align-trigger
          >
            <md-button
              class="md-just-icon md-simple md-secondary"
              md-menu-trigger
            >
              <md-icon> more_horiz </md-icon>
            </md-button>
            <md-menu-content>
              <md-menu-item @click="editUser(item)">
                <div style="display: flex">
                  <span>Edit</span>
                </div>
              </md-menu-item>
              <md-menu-item @click="editPassword(item)">
                <div style="display: flex">
                  <span>Change Password</span>
                </div>
              </md-menu-item>
              <md-menu-item
                @click="deleteUser(item)"
                v-if="item.role !== 'admin'"
              >
                <div style="display: flex">
                  <span style="color: red">Delete</span>
                </div>
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </md-table-cell>
      </md-table-row>

      <md-table-pagination
        :md-page-size="10"
        :md-page-options="[10, 20, 30, 40, 50, 60]"
        :md-data="searched"
        :md-paginated-data.sync="paginatedUsers"
      />
    </md-table>

    <md-dialog-confirm
      :md-active.sync="userDelete.isDelete"
      md-title="Do you want to delete?"
      md-content="This action will permanently delete user in database and cannot be restored. 
      Do you want to continue?"
      style="max-width: 720px; margin: auto"
      md-confirm-text="Delete"
      md-cancel-text="Cancel"
      @md-confirm="confirmDelete"
    />

    <md-dialog :md-active.sync="userEdit.isEdit">
      <md-dialog-title>Edit User</md-dialog-title>
      <md-dialog-content>
        <div class="dialog-content">
          <div>
            <md-field>
              <label>Name</label>
              <md-input v-model="userEdit.name"></md-input>
            </md-field>
            <md-field>
              <label>Email</label>
              <md-input v-model="userEdit.email"></md-input>
            </md-field>
          </div>
        </div>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="userEdit.isEdit = false"
          >Close</md-button
        >
        <md-button
          class="md-primary"
          @click="confirmEdit"
          :disabled="!userEdit.name"
        >
          Edit
        </md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog :md-active.sync="userPassword.isChange">
      <md-dialog-title>Change Password</md-dialog-title>
      <md-dialog-content>
        <div class="dialog-content">
          <md-field>
            <label>Password</label>
            <md-input v-model="userPassword.password"></md-input>
          </md-field>
        </div>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="userPassword.isChange = false"
          >Close</md-button
        >
        <md-button
          class="md-primary"
          @click="confirmChange"
          :disabled="!userPassword.password"
        >
          OK
        </md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import time from "@/mixins/time";

export default {
  name: "user-table",
  components: {},
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  mixins: [time],
  data() {
    return {
      search: null,
      searched: [],
      userDelete: {
        id: null,
        isDelete: false,
      },
      userEdit: {
        id: null,
        name: null,
        email: null,
        password: null,
        isEdit: false,
      },
      userPassword: {
        id: null,
        password: null,
        isChange: false,
      },
      paginatedUsers: [],
    };
  },
  computed: {
    ...mapState({
      users: (state) => state.user.users,
      isLoading: (state) => state.user.isLoading,
    }),
  },
  watch: {
    users() {
      this.searched = this.users;
    },
  },
  methods: {
    searchOnTable() {
      this.searched = this.users.filter((user) => {
        return user.firstName
          .concat(" ", user.lastName)
          .toString()
          .toLowerCase()
          .includes(this.search.toLowerCase());
      });
    },
    deleteUser(item) {
      this.userDelete.id = item.id;
      this.userDelete.isDelete = true;
    },
    editUser(item) {
      this.userEdit.id = item.id;
      this.userEdit.name = item.firstName + " " + item.lastName;
      this.userEdit.email = item.email;
      this.userEdit.isEdit = true;
      console.log(this.users);
    },
    editPassword(item) {
      this.userPassword.id = item.id;
      this.userPassword.isChange = true;
    },
    confirmDelete() {
      this.userDelete.id &&
        this.$store.dispatch("deleteUser", { id: this.userDelete.id });
    },
    confirmEdit() {
      this.$store.dispatch("editUser", {
        id: this.userEdit.id,
        name: this.userEdit.name,
        email: this.userEdit.email,
      });
      this.userEdit.isEdit = false;
    },
    confirmChange() {
      this.$store.dispatch("changePassword", {
        id: this.userPassword.id,
        password: this.userPassword.password,
      });
      this.userPassword.isChange = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.user-table {
  display: flex;
  justify-content: center;
}
</style>
