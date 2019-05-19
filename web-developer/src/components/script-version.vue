<template>
  <v-form>
    <v-layout row wrap>
      <v-flex xs12 display-1 mb-4 v-if="version">Version {{version}}</v-flex>
      <v-flex xs12 display-1 mb-4 v-else>New Version</v-flex>
    </v-layout>
    <v-layout row wrap v-if="!version">
      <v-flex xs2>
        <v-text-field 
          label="Version Code"
          :value="script.latestVersionCode+1"
          disabled
        >
      </v-flex>
    </v-layout>
    <v-layout row wrap v-if="!version">
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
    <v-layout row wrap v-if="!version">
      <v-flex xs8 mb-2>
        <v-textarea 
          label="Description"
          placeholder="This is version 1. New version."
          v-model="description"
        >
        </v-textarea>
      </v-flex>
    </v-layout>
    <!-- -->
    <v-layout row wrap v-if="version">
      <v-flex xs2 mb-2>Stable Version</v-flex>
      <v-flex xs8>
        <v-switch
          :value="this.script.stableVersionCode==this.scriptVersion.versionCode"
          :disabled="this.script.stableVersionCode==this.scriptVersion.versionCode"
          :label="(this.script.stableVersionCode==this.scriptVersion.versionCode).toString()"
          @change="setStableVersion">
        </v-switch>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-if="version">
      <v-flex xs2 mb-2>Download Count</v-flex>
      <v-flex xs2 mb-2>{{scriptVersion.downloadCount}}</v-flex>
    </v-layout>
    <v-layout row wrap v-if="version">
      <v-flex xs2 mb-2>Buy Count</v-flex>
      <v-flex xs2 mb-2>{{scriptVersion.buyCount}}</v-flex>
    </v-layout>
    <v-layout row wrap v-if="version">
      <v-flex xs2 mb-2>Description</v-flex>
      <v-flex xs2 mb-2>{{scriptVersion.description}}</v-flex>
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
        <v-btn color="info" @click="newVersion" v-if="!version">Upload New Version</v-btn>
      </v-flex>
    </v-layout>
    
    <full-loading :loading="loading"></full-loading>
  </v-form>
</template>

<script>
function newDefaultData() {
  return {
    loading: false,
    file: null,
    description: '',
    scriptVersion: {},
    // isStableVersion: false,
    alert: '',
  };
}
module.exports = {
  props: ['script', 'version'],
  data: function() {
    return newDefaultData();
  },
  methods: {
    pickIndexZip: function() {
      this.$refs.zip.click();
      console.log(this.script.latestVersionCode);
    },
    onIndexZipPicked: function(e) {
      const files = e.target.files;
      if(files[0] !== undefined) {
        this.file = files[0];
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
      this.loading = true;
      this.alert = '';
      const payload = {
        file: this.file,
        scriptId: this.script.scriptId,
        versionCode: this.script.latestVersionCode + 1,
        description: this.description,
      };
      this.$store.dispatch('developer/newScriptVersion', payload)
      .then(() => {
        this.loading = false;
        this.script.latestVersionCode++;
        this.file = null;
        this.description = '';
      }).catch(() => {
        this.loading = false;
      });
    },
    getVersion: function(v) {
      if (v === 0) {
        return;
      }
      this.loading = true;
      this.$store.dispatch('developer/getScriptVersion', {
        scriptId: this.script.scriptId,
        versionCode: v,
      }).then((scriptVersion) => {
        this.scriptVersion = scriptVersion;
        this.loading = false;
      }).catch(() => {
        this.scriptVersion = {};
        this.loading = false;
      });
    },
    setStableVersion: function() {
      if (this.script.stableVersionCode === this.scriptVersion.versionCode) {
        return;
      }
      this.loading = true;
      this.$store.dispatch('developer/stableScriptVersion', {
        scriptId: this.script.scriptId,
        version: this.scriptVersion.versionCode,
      }).then(() => {
        this.loading = false;
        Vue.set(this.script, 'stableVersionCode', this.scriptVersion.versionCode);
      }).catch(() => {
        this.loading = false;
      });
    },
  },
  mounted: function() {
    this.getVersion(this.version);
  },
  watch: {
    version: function(v) {
      this.getVersion(v);
    },
  },
}
</script>