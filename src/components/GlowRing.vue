<template>
  <div class="ring" :class="{ active, hover }" :style='ringStyle' @click="$emit('click')">
    <div class="core" :class="{ active }" :style="coreStyle"></div>

    <div class="particle-container">
      <div
        v-for="particle in mParticles"
        :key="particle.id"
        class="particle"
        :style="particleStyle(particle)"
      ></div>
    </div>
  </div>
</template>
<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

interface Particle {
  direction: [number, number];
  position: [number, number];
  rotationDirection: [number, number];
  rotation: [number, number];
  initialLifetime: number;
  lifetimeLeft: number;
  id: number;
}

const RING_SIZE_BASE = 50
const PARTICLE_SPEED = 0.1
const PARTICLES_PER_SECOND = 30

@Component
export default class GlowRing extends Vue {
  @Prop({
    required: true
  })
  private active!: boolean;

  @Prop({
    default: false
  })
  private hover!: boolean;

  @Prop({
    default: 50
  })
  private size!: number;

  private mEmitInterval!: number;

  private mUpdateInterval!: number;

  private mParticles: Particle[] = [];

  private get ringStyle () {
    return {
      width: `${this.size}px`,
      height: `${this.size}px`
    }
  }

  private get coreStyle () {
    return {
      'box-shadow': `0px 0px ${0.272 * this.size}px ${0.22 * this.size}px white`
    }
  }

  private particleStyle (particle: Particle) {
    const pos = particle.position
    const rot = particle.rotation

    return {
      opacity: particle.lifetimeLeft / particle.initialLifetime,
      transform: `translate(${pos[0]}px, ${pos[1]}px) rotateX(${rot[0]}rad) rotateY(${rot[1]}rad)`
    }
  }

  private get ringSizeMult () {
    return this.size / RING_SIZE_BASE
  }

  private created () {
    const SECONDS_PER_FRAME = 1 / 60

    let idCounter = 0

    this.mEmitInterval = setInterval(() => {
      if (!this.active) {
        return
      }

      const LIFETIME = 1 + Math.random()

      const rotate = ([x, y]: [number, number], radians: number) => {
        const cos = Math.cos(radians)
        const sin = Math.sin(radians)

        return [
          cos * x - sin * y, sin * x + cos * y
        ] as [number, number]
      }

      const initialPosNorm = rotate([1, 0], Math.random() * 2 * Math.PI)
      const initialPos = initialPosNorm.map(val => val * this.size / 2) as [number, number]
      const directionNorm = rotate(initialPosNorm, (Math.random() - 0.5) * Math.PI * 0.75)
      const rotationNorm = rotate([1, 0], Math.random() * 2 * Math.PI)

      this.mParticles.push({
        direction: directionNorm.map(val => val * PARTICLE_SPEED * this.ringSizeMult) as [number, number],
        position: initialPos.map((val, idx) => val + initialPosNorm[idx]) as [number, number],
        rotationDirection: rotationNorm.map(val => val * SECONDS_PER_FRAME * 3) as [number, number],
        rotation: [0, 0],
        initialLifetime: LIFETIME,
        lifetimeLeft: LIFETIME,
        id: idCounter++
      })
    }, (1 / PARTICLES_PER_SECOND / this.ringSizeMult) * 1000)

    this.mUpdateInterval = setInterval(() => {
      for (let i = 0; i < this.mParticles.length;) {
        const particle = this.mParticles[i]

        particle.lifetimeLeft -= SECONDS_PER_FRAME

        if (particle.lifetimeLeft <= 0) {
          this.mParticles.splice(i, 1)
        } else {
          particle.position = particle.direction.map((val, idx) => particle.position[idx] + val) as [number, number]
          particle.rotation = particle.rotationDirection.map((val, idx) => particle.rotation[idx] + val) as [number, number]
          ++i
        }
      }
    }, SECONDS_PER_FRAME * 1000)
  }

  private beforeDestroy () {
    clearInterval(this.mEmitInterval)
    clearInterval(this.mUpdateInterval)
  }
}

</script>
<style lang="scss" scoped>

.ring {
  transition: box-shadow .5s ease, border-color .75s ease;

  border-radius: 50%;
  border-style: solid;
  border-width: 2px;
  border-color: gray;
  background: #0F0F0F;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &.hover:not(.active) {
    box-shadow: 0px 0px 10px 1px white;
  }

  &.active, &.hover {
    border-color: white;
  }

  .core {
    transition: opacity .75s ease;
    border-radius: 50%;
    opacity: 0;

    &.active {
      opacity: 1;
    }
  }
}

.particle-container {
  position: absolute;
}

.particle {
  $particleSize: 2.5px;

  position: absolute;
  width: $particleSize;
  height: $particleSize;
  border-radius: 25%;
  background: white;
  box-shadow: 0px 0px 10px 1px white;
  transform-origin: center;
  left: -$particleSize / 2;
  top: -$particleSize / 2;
  z-index: -1;
}

</style>
