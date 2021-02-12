<template>
  <div class="app">
    <div class="nav">
      <div
          v-for="{ route, title, size, titleEl } in navProps" :key="route"
          class="nav-item"
      >
        <GlowRing
          :active="isActive(route)"
          :hover="!!hoverStatus[route]"
          :size="size"
          @click="nav(route)"
          @mouseenter.native="$set(hoverStatus, route, true)"
          @mouseleave.native="$set(hoverStatus, route, false)"
        ></GlowRing>
        <component
          :is="titleEl"
          class="nav-title"
          :class="{ hover: !!hoverStatus[route] || isActive(route) }"
          @click="nav(route)"
          @mouseenter="$set(hoverStatus, route, true)"
          @mouseleave="$set(hoverStatus, route, false)"
        >
          {{ title }}
        </component>
      </div>
    </div>

    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import GlowRing from '@/components/GlowRing.vue'
import { rootPages } from '@/router/index'

@Component({
  components: {
    GlowRing
  }
})
export default class App extends Vue {
  private hoverStatus: { [key: string]: boolean} = {};

  private isActive (routeName: string) {
    return this.$route.name === routeName
  }

  private nav (routeName: string) {
    this.$router.push({ name: routeName })
  }

  private get navProps () {
    const extraProps: { [key: string]: {} } = {
      about: {
        size: 60,
        titleEl: 'h2'
      }
    }

    return rootPages.map(page => (
      Object.assign({
        title: page,
        route: page,
        size: 45,
        titleEl: 'h3'
      }, extraProps[page] ?? {})
    ))
  }
}

</script>

<style lang="scss">

@import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@200;300;400;500;600;700;800;900&display=swap');

html, body {
  width: 100%;
  height: 100%;
}

h1 {
  font-size: 4rem;
  font-weight: 100;
}
h2 {
  font-size: 3rem;
  font-weight: 300;
}
h3 {
  font-size: 2rem;
  font-weight: 400;
}

:is(h1, h2, h3, h4, h5, h6) {
  color: #ddd;
}

body {
  overflow: hidden;
  font-family: 'Inconsolata', monospace;
  font-weight: 500;
  background: #0f0f0f;
  color: #bbb;
  margin: 0;
}

</style>

<style lang="scss" scoped>

.app {
  height: 100%;
  width: 100%;
  display: flex;
}

.nav {
  height: 100%;
  margin-left: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .nav-item {
    display: flex;
  }

  .nav-item:first-child {
    margin-bottom: 55%;
    margin-top: 50px;
  }

  .nav-item:not(:first-child) {
    padding: 20px 0;
    margin-left: 100px;
  }

  .nav-item:last-child {
    margin-bottom: auto;
  }

  .nav-title {
    transition: text-shadow .75s ease;
    margin: auto;
    margin-left: 20px;
    cursor: pointer;

    &.hover {
      text-shadow: 0 0 8px white;
    }
  }
}

.content {
  margin-left: 200px;
  overflow-y: auto;
}

</style>
