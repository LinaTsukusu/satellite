<template lang="pug">
  v-app
    v-content
      router-view
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {ipcRenderer} from 'electron'

  @Component
  export default class App extends Vue {
    public mounted() {
      this.$router.push('/')
      ipcRenderer.send('start')
    }
  }
</script>

<style lang="stylus">
  html
    overflow-y hidden
</style>
