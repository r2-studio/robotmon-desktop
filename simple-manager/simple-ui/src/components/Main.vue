<template>
  <v-container>
    <LoadingDialog :value="loading" :title="loadingTitle" :message="loadingMessage"></LoadingDialog>
    <AlertDialog :value="alert" :title="alertTitle" :message="alertMessage" v-on:close="hideAlert"></AlertDialog>
    <v-layout wrap>
      <v-flex xs12 md5>
        <Devices></Devices>
      </v-flex>
      <v-flex xs12 md7></v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import AlertDialog from "./Alert";
import LoadingDialog from "./Loading";
import Devices from "./Devices";

export default {
  components: {
    AlertDialog,
    LoadingDialog,
    Devices
  },
  data: () => ({}),
  computed: {
    ...mapState('ui', [
      "loading",
      "loadingTitle",
      "loadingMessage",
      "alert",
      "alertTitle",
      "alertMessage"
    ]),
  },
  methods: {
    ...mapMutations('ui', ['hideAlert']),
  },
};
</script>
