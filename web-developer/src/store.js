// Global Store Variables
var store = new Vuex.Store({
  state: {
    alertTitle: '',
    alertMessage: '',
  },
  mutations: {
    alert: function(state, data) {
      state.alertTitle = data.title;
      state.alertMessage = data.message;
    },
  },
  actions: {
    httpError: function(context, payload) {
      context.commit('alert', {title: '', message: ''});
      const data = {
        title: 'Error: ' + payload.code,
        message: payload.message,
      };
      try {
        const msg = JSON.parse(payload.message);
        data.title = 'Error Code: ' + msg.code;
        data.message = msg.msg;
      } catch(e) {}
      context.commit('alert', data);
    },
  },
  modules: {
    firebase: FirebaseModule,
    developer: DeveloperModule,
  }
});