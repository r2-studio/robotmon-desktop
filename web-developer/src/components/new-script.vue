<template>
  <v-form>
    <v-layout row wrap>
      <v-flex xs12 display-1 mb-4>New Script</v-flex>
      <v-flex xs8 mb-2>
        <v-text-field 
          label="Script ID"
          placeholder="com.r2studio.firstscript"
          hint="Unique ID"
          v-model="scriptId"
        >
        </v-text-field>
      </v-flex>
      <v-flex xs8 mb-2>
        <v-text-field 
          label="Display Name"
          placeholder="My Script"
          hint="Script Name"
          v-model="displayName"
        >
        </v-text-field>
      </v-flex>
      <v-flex xs8 mb-2>
        <v-text-field 
        label="Taget Game Package Name"
        placeholder="com.linecorp.LGTMTMG"
        hint="This effect your script icon"
        v-model="gamePackageName"
      >
      </v-text-field>
      </v-flex>
      <v-flex xs8 mb-2>
        <v-textarea 
          label="Description"
          placeholder="This is my first script. Holp you love this."
          v-model="description"
        >
        </v-textarea>
      </v-flex>
      <v-flex xs8 mb-2 v-if="alert != ''">
        <v-alert :value="true" type="warning" >
          {{alert}}
        </v-alert>
      </v-flex>
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
      return ok;
    },
  },
};
</script>