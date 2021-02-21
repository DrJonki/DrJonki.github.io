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
import colors from '@/scss/colors.scss'
import { Vec2 } from '@/ts/vec'

interface Particle {
  direction: Vec2;
  position: Vec2;
  rotationDirection: Vec2;
  rotation: Vec2;
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
      'box-shadow': `0px 0px ${0.272 * this.size}px ${0.22 * this.size}px ${colors['secondary-color']}`
    }
  }

  private particleStyle (particle: Particle) {
    const pos = particle.position
    const rot = particle.rotation

    return {
      opacity: Math.min(
        (particle.initialLifetime - particle.lifetimeLeft) / 0.2,
        particle.lifetimeLeft / particle.initialLifetime * 1.2
      ),
      transform: `translate(${pos.x}px, ${pos.y}px) rotateX(${rot.x}rad) rotateY(${rot.x}rad)`
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

      const initialPosNorm = new Vec2(1, 0).rotated(Math.random() * 2 * Math.PI)
      const initialPos = initialPosNorm.product(this.size / 2)
      const directionNorm = initialPosNorm.rotated((Math.random() - 0.5) * Math.PI * 0.75)
      const rotationNorm = new Vec2(1, 0).rotated(Math.random() * 2 * Math.PI)

      this.mParticles.push({
        direction: directionNorm.product(PARTICLE_SPEED * this.ringSizeMult),
        position: initialPos.sum(initialPosNorm),
        rotationDirection: rotationNorm.product(SECONDS_PER_FRAME * 3),
        rotation: new Vec2(0, 0),
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
          particle.position = particle.direction.sum(particle.position)
          particle.rotation = particle.rotationDirection.sum(particle.rotation)
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

@import "@/scss/colors.scss";

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
    box-shadow: 0px 0px 10px 1px $main-color;
  }

  &.active, &.hover {
    border-color: $main-color;
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
  background: $main-color;
  box-shadow: 0px 0px 10px 1px $main-color;
  transform-origin: center;
  left: -$particleSize / 2;
  top: -$particleSize / 2;
  z-index: -1;
}

</style>
