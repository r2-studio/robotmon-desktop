<template>
  <v-dialog :value="loading" persistent fullscreen>
    <v-layout align-center fill-height justify-space-between>
      <v-flex class="text-xs-center">
      <v-progress-circular indeterminate color="primary" size="200" width="7"></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-dialog>
</template>

<script>
module.exports = {
  props: ['loading'],
}
</script>

