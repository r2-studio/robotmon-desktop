<template>
  <v-form>
    <v-layout row wrap>
      <v-flex xs12 display-1 mb-4 v-if="edit">Edit Script</v-flex>
      <v-flex xs12 display-1 mb-4 v-else>New Script</v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs8 mb-2>
        <v-text-field 
          label="Script ID"
          placeholder="com.r2studio.firstscript"
          hint="Unique ID"
          v-model="scriptId"
          :disabled="edit"
        >
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs8 mb-2>
        <v-text-field 
          label="Display Name"
          placeholder="My Script"
          hint="Script Name"
          v-model="displayName"
        >
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs8 mb-2>
        <v-text-field 
          label="Taget Game Package Name"
          placeholder="com.linecorp.LGTMTMG"
          hint="This effect your script icon"
          v-model="gamePackageName"
        >
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs8 mb-2>
        <v-textarea 
          label="Description"
          placeholder="This is my first script. Holp you love this."
          v-model="description"
        >
        </v-textarea>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-radio-group row v-model="payPlan" @change="onPayClick" :disabled="edit">
        <v-radio :label="`Free`" :value="0"></v-radio>
        <v-radio :label="`Pay`" :value="2"></v-radio>
      </v-radio-group>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs11 mb-2>
       <v-slider 
        v-model="payPeriodSelection"
        label="Period"
        value="5"
        min="0"
        max="5"
        :disabled="payPlan==0 || edit"
        :tick-labels="periodLabels">
      </v-slider>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs11 mb-2>
       <v-slider 
        v-model="payMount"
        label="Price Points" 
        value="0"
        step="5"
        min="0"
        max="300"
        :disabled="payPlan==0 || edit"
        thumb-label="always">
      </v-slider>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs8 mb-2 v-if="alert != ''">
        <v-alert :value="true" type="warning" >
          {{alert}}
        </v-alert>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs8></v-flex>
      <v-flex xs4>
        <v-btn color="info" @click="submit" v-if="edit">Update Script</v-btn>
        <v-btn color="info" @click="submit" v-else>Create Script</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 display-1 mb-4>Script Versions</v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs8 v-if="edit">
        <v-btn color="grey lighten-1" @click="newVersion">New Version</v-btn>
        <v-btn 
          v-for="i in (script.latestVersionCode > 3 ? 3 : script.latestVersionCode)" 
          :key="i" 
          color="grey lighten-2" 
          @click="getVersion(i)">
          V {{script.latestVersionCode-i+1}}
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap mt-5>
      <v-flex xs12>
        <script-version v-if="showVersion" :script="script" :version="version"></script-version>
      </v-flex>
    </v-layout>
    <full-loading :loading="loading"></full-loading>
  </v-form>
</template>

<style></style>

<script>
function newDefaultData() {
  return {
    showVersion: false,
    version: 0,
    edit: false,
    loading: false,
    alert: "",
    scriptId: "",
    displayName: "",
    gamePackageName: "",
    description: "",
    payPlan: 0,
    payMount: 0,
    payPeriod: 0,
    payPeriodSelection: 5,
    periodLabels: [
      '1H (One Time)',
      '1 Day',
      '7 Day',
      '30 Day',
      '3 Month',
      '1 Year',
    ],
    periodMappingTime: [
      3600 * 1000,
      24 * 3600 * 1000,
      7 * 24 * 3600 * 1000,
      30 * 24 * 3600 * 1000,
      90 * 24 * 3600 * 1000,
      365 * 24 * 3600 * 1000,
    ],
  };
}

module.exports = {
  props: ['script'],
  data: function() {
    return newDefaultData();
  },
  methods: {
    submit: function() {
      const ok = this.checkFields();
      if (!ok) {
        return;
      }
      let dispatch = '';
      if (this.edit) {
        dispatch = 'developer/updateScript';
        console.log('update script', this.scriptId);
      } else {
        dispatch = 'developer/newScript';
        console.log('new script', this.scriptId);
      }
      this.loading = true;
      this.$store.dispatch(dispatch, {
        scriptId: this.scriptId,
        gamePackageName: this.gamePackageName,
        displayName: this.displayName,
        description: this.description,
        payPlan: this.payPlan,
        payPeriod: this.payPeriod,
        payMount: this.payMount,
      }).then(() => {
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    checkFields: function() {
      let ok = true;
      this.alert = '';
      if (this.scriptId === '') {
        ok = false;
        this.alert += 'Script ID not set, ';
      }
      if (this.displayName === '') {
        ok = false;
        this.alert += 'Display Name not set, ';
      }
      if (this.gamePackageName === '') {
        ok = false;
        this.alert += 'Game package name not set, ';
      }
      if (this.description === '') {
        ok = false;
        this.alert += 'Discription not set, ';
      }
      if (this.payPlan === 0) {
        this.payPeriodSelection = 5;
        this.payMount = 0;
      } else if (this.payPlan === 2 && this.payMount === 0) {
        ok = false;
        this.alert += 'Price cloud not be 0 when on Pay Plan';
      }
      if (ok) {
        this.payPeriod = this.periodMappingTime[this.payPeriodSelection];
      }
      return ok;
    },
    onPayClick: function() {
      if (this.payPlan === 0) {
        this.payPeriodSelection = 5;
        this.payMount = 0;
      } else if (this.payPlan === 2) {
        this.payPeriodSelection = 3;
        this.payMount = 30;
      }
    },
    newVersion: function() {
      this.showVersion = true;
      this.version = 0;
    },
    getVersion: function(i) {
      this.showVersion = true;
      this.version = this.script.latestVersionCode - i + 1;
    },
  },
  watch: {
    script: function(script) {
      // set to default value
      const data = newDefaultData();
      for (let key in data) {
        this[key] = data[key];
      }
      if (script !== null) {
        this.edit = true;
        this.alert = "";
        this.scriptId = script.scriptId;
        this.displayName = script.displayName;
        this.gamePackageName = script.gamePackageName;
        this.description = script.description;
        this.payPlan = script.payPlan;
        this.payMount = script.payMount;
        this.payPeriod = script.payPeriod;
        for (let i in this.periodMappingTime) {
          if (this.payPeriod === this.periodMappingTime) {
            this.payPeriodSelection = i;
          }
        }
      } //if
    },
  },
};
</script>