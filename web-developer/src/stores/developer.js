var DeveloperModule = {
  namespaced: true,
  state: {
    userId: "",
    name: "",
    email: "",
    earnPoints: 0,
    scriptRefs: {},
  },
  mutations: {
    update: function(state, payload) {
      state.userId = payload.userId;
      state.name = payload.name;
      state.email = payload.email;
      state.earnPoints = payload.earnPoints;
      state.scriptRefs = payload.scriptRefs;
      console.log('developer state', state);
    },
  },
  actions: {
    getMe: function(context, payload) {
      // newDeveloper if developer not exist create one or get developer
      firebase.functions().httpsCallable('newDeveloper')({
        name: payload.name,
        email: payload.email,
      })
      .then(function(result) {
        const developer = result.data;
        context.commit('update', developer);
      })
      .catch(function(e) {
        console.log('err', e);
      });
    },
  }
};