<template>
  <v-container>
    <LoadingDialog v-model="loading" :title="loadingTitle" :message="loadingMessage"></LoadingDialog>
    <AlertDialog v-model="alert" :title="alertTitle" :message="alertMessage"></AlertDialog>
    <v-card class="mx-auto" tile>
      <v-card-title>Add Device</v-card-title>
      <v-card-text>adb connect to devices</v-card-text>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <v-text-field label="IP:PORT" placeholder="127.0.0.1:62001" v-model="connectIpPort"></v-text-field>
          </v-list-item-title>
        </v-list-item-content>

        <v-list-item-icon>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on">mdi-help-circle-outline</v-icon>
            </template>
            <div>
              <div>Nox (夜神) emulator:</div>
              <div>127.0.0.1:62001 or 127.0.0.1:62025 (62025, 62026, ...)</div>
              <div>BlueStack (BS) emulator:</div>
              <div>127.0.0.1:5555 or 127.0.0.1:5565 (5575, 5585, ...)</div>
              <div>Ld (雷電) emulator:</div>
              <div>127.0.0.1:5555 or 127.0.0.1:5556 (5567, 5558, ...)</div>
              <div>Other Phone via Wifi network (after adb tcpip 5555):</div>
              <div>phone-ip:5555 (192.168.0.3:5555)</div>
            </div>
          </v-tooltip>
        </v-list-item-icon>
      </v-list-item>
      <v-card-actions>
        <v-btn outlined color="error" @click="restart">Restart ADB</v-btn>
        <v-spacer></v-spacer>
        <v-btn outlined color="primary" @click="connect">Add</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>

    <v-card class="mx-auto mt-5" tile>
      <v-card-title>Connected Devices</v-card-title>
      <v-card-text>adb devices</v-card-text>
      <Device v-for="device in devices" :device="device" :key="device.serial"></Device>
    </v-card>
  </v-container>
</template>

<script>
import validate from "../utils/validate";

import { Empty, AdbConnectParams } from "../apprpc/app_pb";
import AppService from "../plugins/AppService";
import AlertDialog from "./Alert";
import LoadingDialog from "./Loading";
import Device from "./Device";

export default {
  components: {
    LoadingDialog,
    AlertDialog,
    Device
  },
  data: () => ({
    loading: false,
    loadingTitle: "",
    loadingMessage: "",
    alert: false,
    alertTitle: "",
    alertMessage: "",
    connectIpPort: "127.0.0.1:62001",
    devices: []
  }),
  methods: {
    showLoading: function(title, message) {
      this.loading = true;
      this.loadingTitle = title;
      this.loadingMessage = message;
    },
    hideLoading: function() {
      this.loading = false;
    },
    popAlert: function(title, message) {
      this.alert = true;
      this.alertTitle = title;
      this.alertMessage = message;
    },
    updateDevices: async function() {
      try {
        this.showLoading("Getting devices", `adb devices`);
        const devicesProto = await AppService.getInstence().getDevices(
          new Empty()
        );
        this.hideLoading();
        const devices = devicesProto.getDevicesList();
        this.$set(this, "devices", devices);
      } catch (e) {
        console.log(e.message);
      }
    },
    restart: async function() {
      try {
        this.showLoading(
          "Restart ADB server",
          `adb kill-server; adb start-server`
        );
        await AppService.getInstence().adbRestart(new Empty())
        this.hideLoading();
        this.updateDevices();
      } catch (e) {
        this.popAlert("Add Device Error", `${e.message}`);
      }
    },
    connect: async function() {
      if (!validate.validateIpAndPort(this.connectIpPort)) {
        return this.popAlert(
          "Address Format Error",
          `"${this.connectIpPort}" should be "ip:port"`
        );
      }
      const parts = this.connectIpPort.split(":");
      const request = new AdbConnectParams();
      request.setIp(parts[0]);
      request.setPort(parts[1]);
      try {
        this.showLoading(
          "Adding device...",
          `adb connect ${this.connectIpPort}`
        );
        const result = await AppService.getInstence().adbConnect(request);
        this.hideLoading();
        this.popAlert(
          "Add Device Success",
          `New Device: ${result.getMessage()}`
        );
        this.updateDevices();
      } catch (e) {
        this.popAlert(
          "Add Device Error",
          `"${this.connectIpPort}": ${e.message}`
        );
      }
    }
  },
  mounted: function() {
    this.updateDevices();
  }
};
</script>
