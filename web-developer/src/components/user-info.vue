<template>
  <v-toolbar app fixed dense clipped-left>
    <v-toolbar-title>Robotmon Developer</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-title v-if="user">{{user.displayName}}</v-toolbar-title>
    <v-toolbar-items v-if="user" class="hidden-sm-and-down">
      <v-btn flat @click="logout">Logout</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<style></style>

<script>
module.exports = {
  props: {
    'user': Object | undefined,
  },
  methods: {
    logout: function () {
      this.$store.dispatch('firebase/logout');
    }
  },
};
</script>