const user = {
  state: {
    token: null,
    error: null,
  },
  getters: {

  },
  mutations: {
    clearToken(state) {
      state.token = null;
    },
    setToken(state, value) {
      state.token = value;
    },
    authenticate(state) {
      const token = localStorage.getItem('token');
      state.token = token;
    },
    logout(state) {
      state.token = null;
      localStorage.removeItem('token');
      location.reload();
    },
  },
  actions: {

  },
}
export default user;