<template>
  <transition name="fade" mode="out-in" appear>
    <router-view :key="$route.path"></router-view>
  </transition>
</template>
<style lang="scss" scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity .25s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
