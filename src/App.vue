<template>
  <div id="app">
    <Login />
  </div>
</template>

<script>
import Login from './components/Login.vue'

export default {
  name: 'app',
  components: {
    Login
  }
}
</script>

<style>
body,html,#app {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
