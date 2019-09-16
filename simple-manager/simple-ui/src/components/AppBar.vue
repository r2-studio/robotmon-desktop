<template>
  <v-app-bar app dense>
    <v-toolbar-title class="headline text-uppercase">
      <v-avatar>
        <v-img :src="require('../assets/logo.png')" contain height="50" width="50"></v-img>
      </v-avatar>
      <span> Robotomon</span>
      <span class="font-weight-light"> Simple Service Manager</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn text href="https://www.robotmon.app/" target="_blank">
      <span class="mr-2">Website</span>
    </v-btn>
  </v-app-bar>
</template>