<template>
  <v-container>
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
      <v-card-text>
        <v-btn outlined color="primary" small class="mr-1" @click="updateDevices">Update</v-btn>adb devices
      </v-card-text>
      <v-card-text>
        <v-textarea outlined label="adb shell" rows="8" class="caption" v-model="shell"></v-textarea>
      </v-card-text>
      <Device
        v-for="device in devices"
        :device="device"
        :key="device.getSerial()"
        @update="updateDevices"
        @runShell="runShell"
        @log="downloadLog"
      ></Device>
    </v-card>
  </v-container>
</template>

<script>
import { mapMutations } from "vuex";
import {
  SHOW_LOADING,
  HIDE_LOADING,
  SHOW_ALERT,
  HIDE_ALERT,
  APPEND_ADB_LOGGER
} from "../store/types";

import validate from "../utils/validate";
import { Empty, AdbConnectParams, AdbShellParams } from "../apprpc/app_pb";
import AppService from "../plugins/AppService";
import Device from "./Device";

export default {
  components: {
    Device
  },
  data: () => ({
    connectIpPort: "127.0.0.1:62001",
    devices: [],
    shell: "ls -al /sdcard/Robotmon/"
  }),
  methods: {
    ...mapMutations("ui", [
      SHOW_LOADING,
      HIDE_LOADING,
      SHOW_ALERT,
      HIDE_ALERT,
      APPEND_ADB_LOGGER
    ]),
    updateDevices: async function() {
      try {
        this[APPEND_ADB_LOGGER]("adb devices");
        this.$set(this, "devices", []);
        this[SHOW_LOADING]({
          title: "Getting devices",
          message: "adb devices"
        });
        const devicesProto = await AppService.getInstence().getDevices(
          new Empty()
        );
        this[HIDE_LOADING]();
        const devices = devicesProto.getDevicesList();
        this.$set(this, "devices", devices);
      } catch (e) {
        this[HIDE_LOADING]();
        this[SHOW_ALERT]({ title: "Add Devices Error", message: e.message });
      }
    },
    restart: async function() {
      try {
        this[APPEND_ADB_LOGGER]("adb kill-server; adb start-server");
        this[SHOW_LOADING]({
          title: "Restart ADB server",
          message: "adb kill-server; adb start-server"
        });
        await AppService.getInstence().adbRestart(new Empty());
        this[HIDE_LOADING]();
        this.updateDevices();
      } catch (e) {
        this[HIDE_LOADING]();
        this[SHOW_ALERT]({ title: "Add Device Error", message: e.message });
      }
    },
    connect: async function() {
      if (!validate.validateIpAndPort(this.connectIpPort)) {
        this[SHOW_ALERT]({
          title: "Address Format Error",
          message: `"${this.connectIpPort}" should be "ip:port"`
        });
        return;
      }

      const parts = this.connectIpPort.split(":");
      const request = new AdbConnectParams();
      request.setIp(parts[0]);
      request.setPort(parts[1]);
      try {
        this[APPEND_ADB_LOGGER](`adb connect ${this.connectIpPort}`);
        this[SHOW_LOADING]({
          title: "Adding device...",
          message: `adb connect ${this.connectIpPort}`
        });
        const result = await AppService.getInstence().adbConnect(request);
        this[HIDE_LOADING]();
        if (result.getMessage() !== "") {
          this[SHOW_ALERT]({
            title: "Add Device Success",
            message: `New Device: ${result.getMessage()}`
          });
        } else {
          this[SHOW_ALERT]({
            title: "No Device Found",
            message: `Device: ${result.getMessage()}`
          });
        }
        this.updateDevices();
      } catch (e) {
        this[HIDE_LOADING]();
        this[SHOW_ALERT]({
          title: "Add Device Error",
          message: `"${this.connectIpPort}": ${e.message}`
        });
      }
    },
    runShell: async function(serial) {
      const shellReq = new AdbShellParams();
      shellReq.setSerial(serial);
      shellReq.setCommand(this.shell);
      this[APPEND_ADB_LOGGER](`adb shell -s ${serial} '${this.shell}'`);
      this[SHOW_LOADING]({
        title: "Adb Shell Command",
        message: `adb shell -s ${serial} '${this.shell}'`
      });
      try {
        const result = await AppService.getInstence().adbShell(shellReq);
        const message = result.getMessage();
        this[APPEND_ADB_LOGGER](message);
      } catch (e) {
        this[SHOW_ALERT]({
          title: "Add Shell Error",
          message: `"${serial}": ${e.message}`
        });
      }
      this[HIDE_LOADING]();
    },
    downloadLog: async function(serial) {
      const shellReq = new AdbShellParams();
      shellReq.setSerial(serial);
      shellReq.setCommand("cat /sdcard/Robotmon/robotmon.log");
      try {
        const result = await AppService.getInstence().adbShell(shellReq);
        const message = result.getMessage();
        console.log(message.length);
        this.download('robotmon.txt', message);
      } catch (e) {
        this[SHOW_ALERT]({
          title: "Download Robotmon Log Failed",
          message: `"${serial}": ${e.message}`
        });
      }
    },
    download: function(filename, data) {
      var blob = new Blob([data], { type: "text/plain" });
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
      } else {
        var elem = window.document.createElement("a");
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
      }
    }
  },
  mounted: function() {
    this.updateDevices();
  }
};
</script>
