<template>
  <v-container>
    <v-card class="mx-auto" tile>
      <v-card-title>Add Device</v-card-title>
      <v-card-text>adb connect to devices</v-card-text>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <v-text-field label="IP:PORT" placeholder="127.0.0.1:62001" v-model="connectIp"></v-text-field>
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
        <v-spacer></v-spacer>
        <v-btn outlined color="primary">Add</v-btn>
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
import { Empty } from "../apprpc/app_pb";
import AppService from "../plugins/AppService";
import Device from "./Device";

export default {
  components: {
    Device
  },
  data: () => ({
    connectIp: '127.0.0.1:62001',
    devices: []
  }),
  mounted: async function() {
    try {
      const devicesProto = await AppService.getInstence().getDevices(
        new Empty()
      );
      const devices = devicesProto.getDevicesList();
      this.$set(this, "devices", devices);
    } catch (e) {
      console.log(e.message);
    }
  }
};
</script>
