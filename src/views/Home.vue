<template>
  <div>
    Home
    <div class="particle-container">
      <div
        v-for="particle in mParticles" :key="particle.id"
        class="particle"
        :style="particleStyle(particle)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

interface Particle {
  direction: [number, number];
  position: [number, number];
  initialLifetime: number;
  lifetimeLeft: number;
  id: number;
}

const particlesPerSecond = 10

let idCounter = 0

@Component
export default class Home extends Vue {
  private mEmitInterval!: number;
  private mUpdateInterval!: number;

  private mParticles: Particle[] = [];

  particleStyle (particle: Particle) {
    return {
      opacity: particle.lifetimeLeft / particle.initialLifetime,
      transform: `translate(${particle.position[0]}px, ${particle.position[1]}px)`
    }
  }

  created () {
    this.mEmitInterval = setInterval(() => {
      const speed = 0.3
      const lifetime = 1.0 + Math.random()

      const rand = () => (Math.random() - 0.5) * 2.0 * speed

      this.mParticles.push({
        direction: [rand(), rand()],
        position: [0, 0],
        initialLifetime: lifetime,
        lifetimeLeft: lifetime,
        id: idCounter++
      })
    }, (1.0 / particlesPerSecond) * 1000)

    const fps = 60.0
    const secondsPerFrame = 1.0 / fps

    this.mUpdateInterval = setInterval(() => {
      for (let i = 0; i < this.mParticles.length;) {
        const particle = this.mParticles[i]

        particle.lifetimeLeft -= secondsPerFrame

        if (particle.lifetimeLeft <= 0) {
          this.mParticles.splice(i, 1)
        } else {
          particle.position[0] += particle.direction[0]
          particle.position[1] += particle.direction[1]
          ++i
        }
      }
    }, secondsPerFrame * 1000)
  }

  beforeDestroy () {
    clearInterval(this.mEmitInterval)
    clearInterval(this.mUpdateInterval)
  }
}
</script>

<style lang="scss" scoped>
.particle-container {
  position: absolute;
  left: 200px;
  top: 200px;
}

.particle {
  $particleSize: 2.5px;

  position: absolute;
  width: $particleSize;
  height: $particleSize;
  border-radius: $particleSize / 2;
  background: white;
  box-shadow: 0px 0px 10px 1px rgba(255, 255, 255, 1);
}
</style>
