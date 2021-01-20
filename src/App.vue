<template>
<div class="app">
  <router-view></router-view>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class App extends Vue {}
</script>

<style>

html, body {
  background: #0F0F0F;
  color: #DDD;
}

</style>

<style scoped>

.app {
  height: 100%;
  width: 100%;
}

</style>
