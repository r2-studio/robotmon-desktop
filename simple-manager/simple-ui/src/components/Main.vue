<template>
  <v-container fluid>
    <LoadingDialog :value="loading" :title="loadingTitle" :message="loadingMessage"></LoadingDialog>
    <AlertDialog :value="alert" :title="alertTitle" :message="alertMessage" v-on:close="hideAlert"></AlertDialog>
    <v-layout wrap>
      <v-flex xs12 md5>
        <Devices></Devices>
      </v-flex>
      <v-flex xs12 md7>
        <Editor></Editor>
      </v-flex>
    </v-layout>
    <Logger></Logger>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Logger from "./Logger";
import AlertDialog from "./Alert";
import LoadingDialog from "./Loading";
import Devices from "./Devices";
import Editor from "./Editor";

export default {
  components: {
    Logger,
    AlertDialog,
    LoadingDialog,
    Devices,
    Editor
  },
  data: () => ({}),
  computed: {
    ...mapState("ui", [
      "loading",
      "loadingTitle",
      "loadingMessage",
      "alert",
      "alertTitle",
      "alertMessage"
    ])
  },
  methods: {
    ...mapMutations("ui", ["hideAlert"])
  }
};
</script>
