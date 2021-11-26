import { axiosInstance } from "../../utils";

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
    async login(context, { username, password }) {
      try {
        const session = await axiosInstance.post('/api/signin', { email: username, password });
        console.log(session);
        const token = session.data.token;
        context.commit('setToken', token);
        localStorage.setItem('token', token);
      } catch (error) {
        context.state.error = "User name or password is incorrect";
        setTimeout(() => {
          context.state.error = null;
        }, 3000)
      }
    },
  },
}
export default user;