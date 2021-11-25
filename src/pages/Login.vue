<template>
  <div class="Login">
    <md-content class="md-elevation-3">
      <div class="title">
        <img src="meeting-logo.png" />
        <h3 class="md-title">Meeting Admin</h3>
        <div>This is an admin page</div>
      </div>
      <div class="alert-login" style="color: red">{{ getError() }}</div>    

      <div class="form">
        <md-field>
          <label>E-mail</label>
          <md-input
            v-model="auth.username"
            @keyup.enter="handleLogin"
            autofocus
          ></md-input>
        </md-field>

        <md-field md-has-password>
          <label>Password</label>
          <md-input
            v-model="auth.password"
            @keyup.enter="handleLogin"
            type="password"
          ></md-input>
        </md-field>
      </div>

      <div class="actions md-layout md-alignment-center-space-between">
        <md-button class="md-raised md-primary" @click="handleLogin"
          >Log in</md-button
        >
      </div>

      <div class="loading-overlay" v-if="loading">
        <md-progress-spinner
          md-mode="indeterminate"
          :md-stroke="2"
        ></md-progress-spinner>
      </div>
    </md-content>
    <div class="background" />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      auth: {
        username: "",
        password: "",
      },
    };
  },
  computed: {
    ...mapState({
      error: (state) => state.auth.error,
    }),
  },
  methods: {
    getError() {
      if (this.error) {
        this.loading = false;
        return this.error;
      }
      return "";
    },
    handleLogin() {
      this.loading = true;
      this.$store.dispatch("login", {
        username: this.auth.username,
        password: this.auth.password,
      });
      this.auth.username = null;
      this.auth.password = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.Login {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100vh;

  .title {
    text-align: center;
    margin-bottom: 30px;
    img {
      margin-bottom: 16px;
      max-width: 80px;
    }
  }

  .actions {
    .md-button {
      margin: 0;
    }
  }
  .form {
    margin-bottom: 60px;
  }
  .background {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 0;
  }
  .md-content {
    z-index: 1;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    position: relative;
  }
  .loading-overlay {
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
