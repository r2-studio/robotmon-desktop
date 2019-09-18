<template>
  <v-dialog v-model="value" width="500" height="500" :persistent="true">
    <v-card class="text-center">
      <v-card-title class="headline grey lighten-2" primary-title>{{title}}</v-card-title>
      <v-progress-circular class="mt-3 mb-3" :size="100" color="primary" indeterminate></v-progress-circular>
      <v-card-text>{{message}}</v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["value", "title", "message"],
  data: () => ({})
};
</script>