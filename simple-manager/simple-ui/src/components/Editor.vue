<template>
  <v-container>
    <v-card class="mx-auto" tile>
      <v-card-title>Script Editor</v-card-title>
      <div>
        <v-icon large style="float:right;" :color="saved?'green':'red'">mdi-content-save</v-icon>
        <v-btn small @click="changeCode(0)" :dark="codeIdx==0">
          <v-icon>mdi-numeric-0-box-outline</v-icon>
        </v-btn>
        <v-btn small @click="changeCode(1)" :dark="codeIdx==1">
          <v-icon>mdi-numeric-1-box-outline</v-icon>
        </v-btn>
        <v-btn small @click="changeCode(2)" :dark="codeIdx==2">
          <v-icon>mdi-numeric-2-box-outline</v-icon>
        </v-btn>
        <v-btn small @click="changeCode(3)" :dark="codeIdx==3">
          <v-icon>mdi-numeric-3-box-outline</v-icon>
        </v-btn>
        <v-btn small @click="changeCode(4)" :dark="codeIdx==4">
          <v-icon>mdi-numeric-4-box-outline</v-icon>
        </v-btn>
        <v-btn small @click="changeCode(5)" :dark="codeIdx==5">
          <v-icon>mdi-numeric-5-box-outline</v-icon>
        </v-btn>
        <v-btn small @click="changeCode(6)" :dark="codeIdx==6">
          <v-icon>mdi-numeric-6-box-outline</v-icon>
        </v-btn>
        <v-btn small @click="changeCode(7)" :dark="codeIdx==7">
          <v-icon>mdi-numeric-7-box-outline</v-icon>
        </v-btn>
        <v-btn small @click="changeCode(8)" :dark="codeIdx==8">
          <v-icon>mdi-numeric-8-box-outline</v-icon>
        </v-btn>
        <v-btn small @click="changeCode(9)" :dark="codeIdx==9">
          <v-icon>mdi-numeric-9-box-outline</v-icon>
        </v-btn>
      </div>
      <PrismEditor
        id="editor"
        v-model="code"
        language="js"
        lineNumbers
        style="height: 440px; box-shadow: none;"
        class="font-weight-bold caption mt-2"
        @change="codeChanged"
      ></PrismEditor>
    </v-card>
  </v-container>
</template>

<script>
import { mapMutations } from "vuex";
import PrismEditor from "vue-prism-editor";
import { PUSH_CODE } from "../store/types";
import CodesUtils from "../utils/codes";

export default {
  components: {
    PrismEditor
  },
  data: () => ({
    saved: true,
    codeIdx: 0,
    code: "console.log(123)",
    codes: [],
    autoSaveId: 0
  }),
  mounted: function() {
    const codesJSON = this.$localStorage.get("codes");
    let codes = JSON.parse(codesJSON);
    if (codes === undefined || codes === null) {
      codes = CodesUtils.defaultCodes;
      this.saved = false;
    }
    this.codes = codes;
    this.setCodeEditor();
  },
  methods: {
    ...mapMutations("ui", [PUSH_CODE]),
    codeChanged: function() {
      this.saved = false;
      clearTimeout(this.autoSaveId);
      this.autoSaveId = setTimeout(() => {
        this.save();
      }, 1500);
    },
    changeCode: function(idx) {
      if (this.codeIdx === idx) {
        return;
      }
      if (idx < 0 || idx > 9) {
        return;
      }
      this.save();
      this.codeIdx = idx;
      this.setCodeEditor();
    },
    setCodeEditor: function() {
      this.code = this.codes[this.codeIdx];
      this[PUSH_CODE](this.code);
    },
    save: function() {
      if (this.saved) {
        return;
      }
      this.codes[this.codeIdx] = this.code;
      this.$localStorage.set("codes", JSON.stringify(this.codes));
      this.saved = true;
      this.setCodeEditor();
    }
  }
};
</script>

<style>
#editor code {
  -webkit-box-shadow: none;
  box-shadow: none;
}
#editor code:before {
  content: none;
}
</style>