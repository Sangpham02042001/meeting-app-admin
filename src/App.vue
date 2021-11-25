<template>
  <div class="App">
    <div v-if="token">
      <router-view></router-view>
    </div>
    <Login v-else />
  </div>
</template>

<script>
import Common from "./mixins";
import Login from "@/pages/Login";
export default {
  components: {
    Login,
  },
  mixins: [Common],
  methods: {
  },
};
</script>
<style>
.md-body-1,
.md-body-2,
body {
  font-size: 16px !important;
}
</style>
