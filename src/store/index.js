import Vue from 'vue'
import Vuex from 'vuex'
import user from './module/user';
import team from './module/team'
import auth from './module/auth'

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        user,
        team,
        auth
    }
});
export default store;