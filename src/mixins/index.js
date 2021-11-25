export default {
  created() {
    this.$store.commit('authenticate')
  },
  mounted() {},
  computed: {
    token() {
      return this.$store.state.auth.token;
    }
  }
}