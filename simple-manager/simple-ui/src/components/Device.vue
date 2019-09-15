<template>
  <div>
    <v-divider></v-divider>
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-subtitle>
          <v-icon class="mr-3">mdi-cellphone-link</v-icon>
          <span>{{serial}}</span>
        </v-list-item-subtitle>

        <v-list-item-subtitle v-if="serviceAddress != ''">
          <v-icon class="mr-3">mdi-access-point-network</v-icon>
          <span>{{serviceAddress}}</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle v-else>
          <v-icon class="mr-3">mdi-access-point-network-off</v-icon>
          <span>Can not connect via network</span>
        </v-list-item-subtitle>

        <v-list-item-subtitle v-if="forwardPortFrom != ''">
          <v-icon class="mr-3">mdi-share-outline</v-icon>
          <span>Forward:</span>
          <v-icon class="ml-1">mdi-cellphone-android</v-icon>
          {{forwardPortFrom}}
          <v-icon class="ml-1">mdi-laptop</v-icon>
          {{forwardPortTo}}
        </v-list-item-subtitle>
        <v-list-item-subtitle v-else>
          <v-icon class="mr-3">mdi-share-outline</v-icon>
          <v-btn outlined color="success" small class="mr-1" @click="forward">Forward</v-btn>(adb forward)
        </v-list-item-subtitle>

        <v-list-item-subtitle v-if="serviceLaunched">
          <v-icon class="mr-3">mdi-play-circle-outline</v-icon>
          <v-btn outlined color="error" small class="mr-1">Stop</v-btn>
          <span>Service Launched pid1: {{servicePid1}}, pid2: {{servicePid2}}</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle v-else>
          <v-icon class="mr-3">mdi-stop-circle-outline</v-icon>
          <v-btn outlined color="primary" small class="mr-1">Start</v-btn>
          <span>Service Stopped</span>
        </v-list-item-subtitle>

        <v-list-item-subtitle v-if="connected">
          <v-icon class="mr-3">mdi-lan-connect</v-icon>
          <v-btn outlined color="error" small class="mr-1">Disconnect</v-btn>
        </v-list-item-subtitle>
        <v-list-item-subtitle v-else>
          <v-icon class="mr-3">mdi-lan-disconnect</v-icon>
          <v-btn outlined color="primary" small class="mr-1">Connect</v-btn>
          <span>Service not connected</span>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-icon>
        <v-icon>mdi-clock</v-icon>
      </v-list-item-icon>
    </v-list-item>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import {
  SHOW_LOADING,
  HIDE_LOADING,
  SHOW_ALERT,
  HIDE_ALERT
} from "../store/types";
import { Empty, AdbForwardParams } from "../apprpc/app_pb";
import AppService from "../plugins/AppService";
import Device from "./Device";

export default {
  components: {
    Device
  },
  props: ["device"],
  data: () => ({
    serial: "",
    serviceAddress: "",
    servicePid1: "",
    servicePid2: "",
    serviceLaunched: false,
    forwardPortFrom: "",
    forwardPortTo: "",
    connected: false
  }),
  methods: {
    ...mapMutations("ui", [SHOW_LOADING, HIDE_LOADING, SHOW_ALERT, HIDE_ALERT]),
    initDevice: function() {
      this.serial = this.device.getSerial();
      this.servicePid1 = this.device.getServicepid1();
      this.servicePid2 = this.device.getServicepid2();
      const serviceForward = this.device.getServiceforward();
      this.serviceLaunched = this.device.getServicelaunched();
      const serviceIp = this.device.getServiceip();
      const servicePort = this.device.getServiceport();
      if (serviceIp !== "") {
        this.serviceAddress = `${serviceIp}:${servicePort}`;
      } else {
        this.serviceAddress = ``;
      }
      // parse forward
      if (serviceForward !== undefined) {
        const forwards = serviceForward.split(" ");
        if (forwards.length > 2) {
          this.forwardPortFrom = forwards[1];
          this.forwardPortTo = forwards[2];
        }
      }
    },
    forward: async function() {
      try {
        this[SHOW_LOADING]({
          title: "Forwarding Device",
          message: `adb -s ${this.serial} forward tcp:8081 tcp:`
        });
        let message = await AppService.getInstence().adbForwardList(
          new Empty()
        );
        const forwardResult = message.getMessage();
        const port = this.findNextPort(forwardResult);

        this[SHOW_LOADING]({
          title: "Forwarding Device",
          message: `adb -s ${this.serial} forward tcp:8081 tcp:${port}`
        });

        const param = new AdbForwardParams();
        param.setSerial(this.serial);
        param.setDeviceport("8081");
        param.setPcport(`${port}`);

        message = await AppService.getInstence().adbForward(param);
        const result = message.getMessage();
        this[HIDE_LOADING]();
        this[SHOW_ALERT]({ title: "Add Forwaed Done", message: result });
        this.forwardPortFrom = '8081';
        this.forwardPortTo = `${port}`;
      } catch (e) {
        this[HIDE_LOADING]();
        this[SHOW_ALERT]({ title: "Add Forwaed Error", message: e.message });
      }
    },
    findNextPort: function(forwardResult) {
      let port = 8080;
      const forwards = forwardResult.split("\n");
      for (const forward of forwards) {
        if (forward === "" || forward.find("tcp:8081") === -1) {
          continue;
        }
        const values = forward.split(" ");
        if (values.length > 2) {
          const ports = values[2].split(":");
          if (ports.length === 2) {
            port = +ports[1] > port ? +ports[1] : port;
          }
        }
      }
      return port + 1;
    }
  },
  mounted: async function() {
    this.initDevice();
  }
};
</script>