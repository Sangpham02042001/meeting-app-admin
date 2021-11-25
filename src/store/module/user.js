import { axiosAuth } from "../../utils";

const user = {
    state: {
        users: []
    },
    getters: {

    },
    mutations: {
    },
    actions: {
        async getAllUsers(context) {
            try {
                console.log('hello')
                let response = await axiosAuth.get('/admin/api/users');
                console.log(response.data.users)
                context.users = response.data.users;
            } catch (error) {
                console.log(error)
            }
        }
    }
}
export default user;