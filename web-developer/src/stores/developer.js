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
        context.dispatch('httpError', e, {root: true});
      });
    },
    getMyScripts: function(context, payload) {
      return new Promise((resolve, reject) => {
        firebase.functions().httpsCallable('getMyScripts')({})
        .then(function (result) {
          console.log('getMyScripts result', result.data);
          resolve(result);
        })
        .catch(function (e) {
          context.dispatch('httpError', e, {root: true});
        });
      });
    },
    newScripts: function(context, payload) {
      return new Promise((resolve, reject) => {
        const parameters = {
          scriptId: payload.scriptId,
          gamePackageName: payload.gamePackageName,
          displayName: payload.displayName,
          description: payload.description,
          payPlan: payload.payPlan,
          payPeriod: payload.payPeriod,
          payMount: payload.payMount,
        };
        firebase.functions().httpsCallable('newScript')(parameters)
        .then(function (result) {
          resolve(result);
        })
        .catch(function (e) {
          context.dispatch('httpError', e, {root: true});
        });
      });
    }
  }
};