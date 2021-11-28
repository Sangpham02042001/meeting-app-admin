<template>
  <div class="md-autocomplete">
    <md-autocomplete class="search" v-model="name" :md-options="options">
      <label>Search by {{ title }}...</label>
    </md-autocomplete>
  </div>
</template>

<script>
export default {
  name: "SearchByName",
  props: {
    options: {
      type: Array,
      require: true,
    },
    handleChange: {
      type: Function,
    },
    title: {
      type: String,
    },
  },
  data() {
    return {
      name: "",
    };
  },
  watch: {
    name(newVal) {
      this.$emit("handleChange", { name: newVal });
    },
  },
};
</script>

<style></style>
