<template>
  <div id="firebaseui-auth-container"></div>
</template>

<style></style>

<script>
module.exports = {
  computed: {
    ...Vuex.mapState('firebase', ['loginUI', 'loginConfig']),
  },
  mounted: function () {
    this.$store.dispatch('firebase/showLoginUI', '#firebaseui-auth-container');
  }
}
</script>