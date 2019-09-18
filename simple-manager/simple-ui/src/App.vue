<template>
  <v-app>
    <AppBar></AppBar>
    <v-content>
     <Main></Main>
    </v-content>
  </v-app>
</template>

<script>
import AppBar from "./components/AppBar";
import Main from "./components/Main";

export default {
  name: "App",
  components: {
    AppBar,
    Main,
  },
  data: () => ({
    //
  })
};
</script>
