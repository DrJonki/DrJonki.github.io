<template>
  <div class="app" :style="{ opacity: ready ? 1 : 0}">
    <div class="nav">
      <div
          v-for="{ route, title, size, titleEl } in navProps" :key="route"
          class="nav-item"
      >
        <GlowRing
          :ref="route"
          :active="isActive(route)"
          :hover="isHovering(route)"
          :size="size"
          @click="nav(route)"
          @mouseenter.native="setHover(route, true)"
          @mouseleave.native="setHover(route, false)"
        ></GlowRing>
        <component
          :is="titleEl"
          class="nav-title"
          :class="{ hover: isHovering(route), active: isActive(route) }"
          @click="nav(route)"
          @mouseenter="setHover(route, true)"
          @mouseleave="setHover(route, false)"
        >
          {{ title }}
        </component>
      </div>
    </div>

    <div
      v-for="(wire, idx) in wires" :key="idx"
      class="wire"
    ></div>

    <div class="content">
      <router-view></router-view>
    </div>

    <h6 class="copyright-notice">© 2021 Joona Tiinanen</h6>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import GlowRing from '@/components/GlowRing.vue'
import { rootPages } from '@/router/index'

interface Wire {
  associations: string[];
}

@Component({
  components: {
    GlowRing
  }
})
export default class App extends Vue {
  private resizeListener!: (this: Window, ev: UIEvent) => unknown;

  private hoverStatus: { [key: string]: boolean} = {};
  private ready = false;
  private wires: [string, string][] = []

  private isActive (routeName: string) {
    return this.$route.name === routeName
  }

  private isHovering (routeName: string) {
    return !!this.hoverStatus[routeName]
  }

  private isActiveOrHovering (routeName: string) {
    return this.isActive(routeName) || this.isHovering(routeName)
  }

  private wireColor (key: string) {
    if (this.isActive(key)) {
      return 'gold'
    } else if (this.isHovering(key)) {
      return 'white'
    }

    return 'gray'
  }

  private nav (routeName: string) {
    this.$router.push({ name: routeName })
  }

  private get navProps () {
    const extraProps: { [key: string]: {} } = {
      index: {
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

  private calcWires () {
    const getRingElem = (ref: string) => ([this.$refs[ref]].flat()[0] as GlowRing).$el as Element

    const gap = 20
    const foldOffset = 20

    const topRect = getRingElem('index').getBoundingClientRect()
    const startX = (topRect.left + topRect.right) / 2
    const startY = topRect.bottom + gap

    this.wires = rootPages.slice(1).map(page => {
      const elemRect = getRingElem(page).getBoundingClientRect()
      const endX = elemRect.left - gap
      const endY = (elemRect.top + elemRect.bottom) / 2

      return [page, [`${startX},${startY}`, `${startX},${endY - foldOffset}`, `${startX + foldOffset},${endY}`, `${endX},${endY}`].join(' ')]
    })

    this.ready = true
  }

  private setHover (route: string, hover: boolean) {
    this.$set(this.hoverStatus, route, hover)
  }

  private created () {
    if (this.$route.path !== '/') {
      return
    }

    setTimeout(() => {
      this.$router.push({ name: 'about' })
    }, 1000)
  }

  private mounted () {
    this.$nextTick(() => {
      this.calcWires()

      this.resizeListener = () => {
        this.calcWires()
      }
      window.addEventListener('resize', this.resizeListener)
    })
  }

  private beforeDestroy () {
    window.removeEventListener('resize', this.resizeListener)
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

h1, h2, h3, h4, h5, h6 {
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

@import "@/scss/colors.scss";

.app {
  height: 100%;
  width: 100%;
  display: flex;
}

.nav {
  position: relative;
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
      text-shadow: 0 0 8px $main-color;
    }

    &.active {
      text-shadow: 0 0 8px $secondary-color;
    }
  }
}

.wire {
  position: absolute;
  transform-origin: top center;
}

.content {
  margin-left: 200px;
  flex: 1;
}

.copyright-notice {
  position: fixed;
  color: #333;
  user-select: none;
  bottom: 0;
  margin: 0 0 8px 8px;
}

</style>
