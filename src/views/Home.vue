<template lang="pug">
  v-data-table()
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {ipcRenderer} from 'electron'


  @Component()
  export default class Home extends Vue {
    private comments: CommentData[] = []

    private mounted() {
      ipcRenderer.on('receiveComment', (event: Electron.Event, comments: CommentData[]) => {
        this.comments = comments
      })
    }
  }
</script>

<style scoped lang="stylus">

</style>