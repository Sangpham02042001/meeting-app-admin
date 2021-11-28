import { axiosAuth } from "../../utils";

const user = {
    state: {
        users: [],
        isLoading: false,
    },
    getters: {

    },
    mutations: {
        setLoadingUser(state, { isLoading }) {
            state.isLoading = isLoading;
        }
    },
    actions: {
        async getAllUsers(context) {
            try {
                let response = await axiosAuth.get('/admin/api/users');
                context.commit('setLoadingUser', { isLoading: false });
                context.state.users = response.data.users;
            } catch (error) {
                console.log(error)
            }
        },
        async deleteUser(context, { id }) {
            try {
                await axiosAuth.delete(`/admin/api/users/${id}`);
                let idx = context.state.users.findIndex(user => user.id === id);
                context.state.users.splice(idx, 1);

            } catch (error) {
                console.log(error)

            }
        },
        async editUser(context, { id, name, email }) {
            try {
                let arrName = name.split(' ');
                let firstName = arrName[0];
                arrName.splice(0, 1);
                let lastName = arrName.join(' ');
                await axiosAuth.put(`/admin/api/users/${id}`, {
                    userId: id,
                    firstName,
                    lastName,
                    email
                });
                let idx = context.state.users.findIndex(user => user.id === id);
                context.state.users[idx].firstName = firstName;
                context.state.users[idx].lastName = lastName;


            } catch (error) {
                console.log(error)

            }
        },
        async changePassword(context, { id, password }) {
            try {
                await axiosAuth.patch(`/admin/api/users/${id}`, {
                    userId: id,
                    password
                });
                context.dispatch('getAllUsers')
            } catch (error) {
                console.log(error)

            }
        },
        async addUser(context, { firstName, lastName, email, password }) {
            try {
                const response = await axiosAuth.post(`/api/signup`, {
                    firstName, lastName, email, password
                });

                context.state.users.push(response.data.user);
                context.dispatch('getAllUsers')

            } catch (error) {
                console.log(error)

            }
        }
    }
}
export default user;