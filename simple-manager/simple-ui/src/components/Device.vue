<template>
  <v-list-item>
    <v-list-item-icon>
      <v-icon>mdi-clock</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>{{device.getSerial()}}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import AppService from "../plugins/AppService";
import Device from "./Device";

export default {
  components: {
    Device
  },
  props: ["device"],
  data: () => ({}),
  mounted: async function() {
    console.log("device mounted");
    console.log(this.device);
    console.log(this.device.getSerial());
  }
};
</script>