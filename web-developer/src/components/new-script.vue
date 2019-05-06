<template>
  <v-form>
    <v-layout row wrap>
      <v-flex xs12 display-1 mb-4>New Script</v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs8 mb-2>
        <v-text-field 
          label="Script ID"
          placeholder="com.r2studio.firstscript"
          hint="Unique ID"
          v-model="scriptId"
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
      <v-radio-group row v-model="payPlan" @change="onPayClick">
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
        :disabled="payPlan==0"
        :tick-labels="periodLabels">
      </v-slider>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs11 mb-2>
       <v-slider 
        v-model="payPrice"
        label="Price Points" 
        value="0"
        step="5"
        min="0"
        max="300"
        :disabled="payPlan==0"
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
      <v-flex xs6></v-flex>
      <v-flex xs4>
        <v-btn color="info" @click="newScript">New Script</v-btn>
      </v-flex>
    </v-layout>
  </v-form>
</template>

<style></style>

<script>
module.exports = {
  props: {
  },
  data: function() {
    return {
      alert: "",
      scriptId: "",
      displayName: "",
      gamePackageName: "",
      description: "",
      payPlan: 0,
      payPrice: 0,
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
  },
  methods: {
    newScript: function() {
      console.log('new script', this.scriptId);
      const ok = this.checkFields();
      if (!ok) {
        return;
      }
      // const functions = this.$store.getters['firebase/functions'];
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
        this.payPrice = 0;
      } else if (this.payPlan === 2 && this.payPrice === 0) {
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
        this.payPrice = 0;
      } else if (this.payPlan === 2) {
        this.payPeriodSelection = 3;
        this.payPrice = 30;
      }
    }
  },
};
</script>