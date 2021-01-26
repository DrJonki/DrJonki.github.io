<template>
  <div class="app">
    <glow-ring :active="act" :size="60" @click="act = !act"></glow-ring>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import GlowRing from '@/components/GlowRing.vue'

@Component({
  components: {
    'glow-ring': GlowRing
  }
})
export default class App extends Vue {
  private act = false;
}

</script>

<style lang="scss">

html, body {
  width: 100%;
  height: 100%;
}

body {
  background: #0F0F0F;
  color: #DDD;
  margin: 0;
}

</style>

<style lang="scss" scoped>

.app {
  height: 100%;
  width: 100%;
}

</style>
