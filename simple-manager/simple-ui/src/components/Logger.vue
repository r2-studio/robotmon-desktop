<template>
  <v-footer fixed :height="footerHeight" app elevation="6" dark>
    <v-content class="pt-0 pb-0">
      <v-layout class="mb-1">
        <v-flex xs12 md12 class="text-right">
          <v-btn small outlined color="grey" class="mr-1" @click="expandHeight(120)">
            <v-icon dart small>mdi-arrow-expand-up</v-icon>
          </v-btn>
          <v-btn small outlined color="grey" class="mr-1" @click="expandHeight(-120)">
            <v-icon dart small>mdi-arrow-expand-down</v-icon>
          </v-btn>
          <v-btn small outlined color="grey" class="mr-1" @click="expandADBLogger(-2)">
            <v-icon dart small>mdi-arrow-expand-left</v-icon>
          </v-btn>
          <v-btn small outlined color="grey" class="mr-1" @click="expandADBLogger(2)">
            <v-icon dart small>mdi-arrow-expand-right</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex xs12 :[adbLoggerWidth]="true">
          <v-card class="mx-auto mr-1" tile :height="loggerHeight" hide-overlay dark>
            <div class="text-center font-weight-bold grey--text text--lighten-1 caption">ADB LOGGER</div>
            <v-divider></v-divider>
          </v-card>
        </v-flex>
        <v-flex xs12 :[serviceLoggerWidth]="true">
          <v-card class="mx-auto ml-1" tile :height="loggerHeight" hide-overlay dark>
            <div
              class="text-center font-weight-bold grey--text text--lighten-1 caption"
            >SERVICE LOGGER</div>
            <v-divider></v-divider>
          </v-card>
        </v-flex>
      </v-layout>
    </v-content>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    height: 160,
    loggerWidth: 6,
  }),
  methods: {
    expandHeight: function(dv) {
      if (this.height + dv < 40) {
        return;
      }
      this.height += dv;
    },
    expandADBLogger: function(dv) {
      if (this.loggerWidth + dv < 2 || this.loggerWidth + dv > 10) {
        return;
      }
      this.loggerWidth += dv;
    },
  },
  computed: {
    footerHeight: function() {
      return this.height;
    },
    loggerHeight: function() {
      return this.height - 40;
    },
    adbLoggerWidth: function() {
      return `md${this.loggerWidth}`;
    },
    serviceLoggerWidth: function() {
      return `md${12 - this.loggerWidth}`;
    }
  }
};
</script>