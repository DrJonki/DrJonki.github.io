<template>
  <div style="width: 50%;">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Home extends Vue {}

</script>
