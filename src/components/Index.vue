<template lang='pug'>

.temp

  .mb-4
    v-icon.x-icon(x-large, color='red darken-2') error_outline

  .construction
    | This site is under construction

  .sub.mt-2
    | In the meantime, you may visit my
    a.ml-1(href='https://www.linkedin.com/in/joona-tiinanen/') LinkedIn profile

</template><script>

export default {

}
</script><style lang='scss' scoped>

.temp {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.construction {
  font-weight: 700;
  font-size: 26px;
}

.x-icon {
  font-weight: 700;
  font-size: 6rem;
}

.sub {
  font-size: 14px;

  a {
    text-decoration: none;
    transition: color 250ms ease;

    &:hover {
      border-radius: 3px;
      color: orangered;
    }
  }
}

</style>
