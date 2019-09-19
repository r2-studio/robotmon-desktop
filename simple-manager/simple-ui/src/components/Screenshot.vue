<template>
  <v-snackbar v-model="value" top left :timeout="0">
    <v-container class="pa-0 ma-0">
      <v-layout class="pa-0 ma-0">
        <v-flex xs1>
          <div class="mr-1" style="width:20px; height:20px;" :style="'background: rgb('+r+', '+g+', '+b+')'"></div>
        </v-flex>
        <v-flex xs7 style="min-width: 250px;">{x:{{x}}, y:{{y}}, r: {{r}}, g: {{g}}, b: {{b}}}</v-flex>
        <v-flex xs4>
          <v-btn color="pink" class="ml-0" text @click="collapse" small>
            <v-icon small>mdi-arrow-collapse</v-icon>
          </v-btn>
          <v-btn color="pink" class="ml-0" text @click="expand" xmall>
            <v-icon small>mdi-arrow-expand</v-icon>
          </v-btn>
          <v-btn color="pink" class="ml-0" text @click="$emit('input', false)" small>
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex xs12>
          <canvas
            ref="canvas"
            :width="canvasWidth"
            :height="canvasHeight"
            @mousemove="mousemove"
            @mousedown="mousedown"
          ></canvas>
        </v-flex>
      </v-layout>
    </v-container>
  </v-snackbar>
</template>

<script>
import { mapMutations } from "vuex";
import { APPEND_SERVICE_LOGGER } from "../store/types";

export default {
  props: ["bytes", "deviceWidth", "deviceHeight", "value"],
  data: () => ({
    windowWidthRatio: 0.4,
    windowHeightRatio: 0.6,
    shouldUpdate: true,
    canvasWidth: 0,
    canvasHeight: 0,
    toDeviceRatio: 0.1,
    x: 0,
    y: 0,
    r: 0,
    g: 0,
    b: 0
  }),
  mounted: function() {
    window.addEventListener("resize", () => {
      this.resizeWindow();
      this.shouldUpdate = true;
    });
  },
  methods: {
    ...mapMutations("ui", [APPEND_SERVICE_LOGGER]),
    resizeWindow: function() {
      const whRatio = this.deviceWidth / this.deviceHeight;
      const maxWidth = window.innerWidth * this.windowWidthRatio;
      const maxHeight = window.innerHeight * this.windowHeightRatio;
      if (this.deviceWidth / maxWidth > this.deviceHeight / maxHeight) {
        this.canvasWidth = maxWidth;
        this.canvasHeight = this.canvasWidth / whRatio;
      } else {
        this.canvasHeight = maxHeight;
        this.canvasWidth = this.canvasHeight * whRatio;
      }
      this.canvasWidth = Math.floor(this.canvasWidth);
      this.canvasHeight = Math.floor(this.canvasHeight);
      this.toDeviceRatio = this.deviceWidth / this.canvasWidth;
    },
    updateCanvas: function() {
      if (!this.shouldUpdate) {
        return;
      }
      if (this.bytes === undefined || this.bytes === null) {
        return;
      }
      const canvas = this.$refs.canvas;
      if (canvas === undefined) {
        return;
      }
      const ctx = canvas.getContext("2d");
      ctx.width = this.canvasWidth;
      ctx.height = this.canvasHeight;
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(
          img,
          0,
          0,
          this.deviceWidth,
          this.deviceHeight,
          0,
          0,
          this.canvasWidth,
          this.canvasHeight
        );
        this.getCanvasPixelColor(100, 100);
      };
      const blob = new Blob([this.bytes], { type: "image/jpg" });
      img.src = URL.createObjectURL(blob);
      this.shouldUpdate = false;
    },
    getCanvasPixelColor: function(x, y) {
      const canvas = this.$refs.canvas;
      if (canvas === undefined) {
        return;
      }
      const ctx = canvas.getContext("2d");
      const p = ctx.getImageData(x, y, 1, 1).data;
      return { r: p[0], g: p[1], b: p[2] };
    },
    getCanvasInfo: function(e) {
      const canvasX = e.offsetX;
      const canvasY = e.offsetY;
      const deviceX = Math.floor(canvasX * this.toDeviceRatio);
      const deviceY = Math.floor(canvasY * this.toDeviceRatio);
      const x = Math.min(deviceX, this.deviceWidth - 1);
      const y = Math.min(deviceY, this.deviceHeight - 1);
      const rgb = this.getCanvasPixelColor(canvasX, canvasY);
      let r = 0;
      let g = 0;
      let b = 0;
      if (rgb !== undefined) {
        r = rgb.r;
        g = rgb.g;
        b = rgb.b;
      }
      this.x = x;
      this.y = y;
      this.r = r;
      this.g = g;
      this.b = b;
      return { x, y, r: r, g: g, b: b };
    },
    mousemove: function(e) {
      this.getCanvasInfo(e);
    },
    mousedown: function(e) {
      const info = this.getCanvasInfo(e);
      const msg = `{x: ${info.x}, y: ${info.y}, r: ${info.r}, g: ${info.g}, b: ${info.b}}`;
      this[APPEND_SERVICE_LOGGER](`${msg} (copied)`);
      this.$copyText(msg);
    },
    collapse: function() {

    },
    expand: function() {
      
    }
  },
  updated: function() {
    this.updateCanvas();
  },
  watch: {
    bytes: function() {
      this.resizeWindow();
      this.shouldUpdate = true;
    }
  }
};
</script>