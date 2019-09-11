<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

import * as grpcweb from 'grpc-web'

const {Empty} = require('./apprpc/app_pb');
const {AppServicePromiseClient} = require('./apprpc/app_grpc_web_pb');
const c = new AppServicePromiseClient('http://localhost:9487', null, null);

c.getDevices(new Empty(), {}, function(err, response) {
  console.log(err, response);
});
// import * as apppb from './apprpc/app_pb'

// appgrpc.AppServicePromiseClient()

export default {
  name: 'app',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
