// Global Store Variables
var store = new Vuex.Store({
  // state: {
  //   isLogin: false,
  //   user: undefined,
  //   developer: undefined,
  // },
  // mutations: {
  //   login: function (state, user) {
  //     if (user !== undefined) {
  //       state.isLogin = true;
  //       state.user = user;
  //     }
  //   },
  //   logout: function (state) {
  //     state.isLogin = false;
  //     state.user = undefined;
  //   }
  // },
  modules: {
    firebase: FirebaseModule,
    developer: DeveloperModule,
  }
});