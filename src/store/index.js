import Vue from 'vue'
import Vuex from 'vuex'
import user from './module/user';
import team from './module/team'

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        user,
        team
    }
});
export default store;