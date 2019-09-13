<template>
  <v-container>
    <v-layout wrap>
      <v-flex xs4>
        <Devices></Devices>
      </v-flex>
      <v-flex xs8></v-flex>
    </v-layout>  
  </v-container>
</template>

<script>
import Devices from "./Devices";

export default {
  components: {
    Devices
  },
  data: () => ({})
};
</script>
