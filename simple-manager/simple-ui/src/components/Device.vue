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
          <v-btn outlined color="success" small class="mr-1">Forward</v-btn>(adb forward)
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
          <span>Service disconnected</span>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-icon>
        <v-icon>mdi-clock</v-icon>
      </v-list-item-icon>
    </v-list-item>
  </div>
</template>

<script>
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
        console.log(forwards);
        if (forwards.length > 2) {
          this.forwardPortFrom = forwards[1];
          this.forwardPortTo = forwards[2];
        }
      }
    }
  },
  mounted: async function() {
    this.initDevice();
  }
};
</script>