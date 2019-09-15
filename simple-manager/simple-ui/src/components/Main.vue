<template>
  <v-container>
    <v-layout wrap>
      <v-flex xs12 md5>
        <Devices></Devices>
      </v-flex>
      <v-flex xs12 md7></v-flex>
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
