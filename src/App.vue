<template>
  <div id="app">
    <h2>vue 子应用</h2>
    <div class="menu">
      <router-link to="/">open-editor</router-link>
      <router-link to="/detail">detail</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
export default {
  name: 'App'
}
</script>

<style scoped>
.app {
  padding: 24px;
}
.menu {
  margin-bottom: 24px;
}
.menu a {
  margin-right: 24px;
}
</style>
