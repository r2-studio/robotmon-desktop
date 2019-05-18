<template>
  <v-form>
    <v-layout row wrap>
      <v-flex xs12 display-1 mb-4 v-if="edit">Edit Version</v-flex>
      <v-flex xs12 display-1 mb-4 v-else>New Version</v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs2>
        <v-text-field 
          label="Version Code"
          :value="script.latestVersionCode+1"
          disabled
        >
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs2>
        <v-text-field disabled :value="file ? file.name : 'Pick File'"></v-text-field>
      </v-flex>
      <v-flex xs2>
        <v-text-field disabled :value="file ? file.size + ' bytes' : ''"></v-text-field>
      </v-flex>
      <v-flex xs4>
        <input type="file" style="display: none" ref="zip" accept=".zip" @change="onIndexZipPicked" />
        <v-btn color="success" @click="pickIndexZip">Pick Script (index.zip)</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs8 mb-2>
        <v-textarea 
          label="Description"
          placeholder="This is version 1. New version."
          v-model="description"
        >
        </v-textarea>
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
        <v-btn color="info" @click="newVersion" v-if="!edit">Upload New Version</v-btn>
      </v-flex>
  </v-form>
</template>

<script>
function newDefaultData() {
  return {
    edit: false,
    file: null,
    description: '',
    alert: '',
  };
}
module.exports = {
  props: ['script'],
  data: function() {
    return newDefaultData();
  },
  methods: {
    pickIndexZip: function() {
      this.$refs.zip.click();
    },
    onIndexZipPicked: function(e) {
      const files = e.target.files;
      if(files[0] !== undefined) {
        this.file = files[0];
        console.log(this.file);
			} else {
        this.file = null;
			}
    },
    newVersion: function(e) {
      if (this.file === null) {
        this.alert = 'Please Pick a index.zip file';
        return;
      }
      if (this.description === '') {
        this.alert = 'Please input description';
        return;
      }
      this.alert = '';
      const payload = {
        file: this.file,
        scriptId: this.script.scriptId,
        versionCode: this.script.latestVersionCode + 1,
        description: this.description,
      };
      this.$store.dispatch('developer/newScriptVersion', payload);
    }
  }
}
</script>