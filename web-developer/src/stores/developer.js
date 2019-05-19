var DeveloperModule = {
  namespaced: true,
  state: {
    userId: "",
    name: "",
    email: "",
    earnPoints: 0,
    scripts: [],
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
    updateScripts: function(state, payload) {
      console.log('updateScripts', payload);
      Vue.set(state, 'scripts', payload);
    }
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
        context.dispatch('getMyScripts');
      })
      .catch(function(e) {
        context.dispatch('httpError', e, {root: true});
      });
    },
    getMyScripts: function(context, payload) {
      return new Promise((resolve, reject) => {
        firebase.functions().httpsCallable('getMyScripts')({})
        .then(function (result) {
          context.commit('updateScripts', result.data);
          resolve(result);
        })
        .catch(function (e) {
          context.dispatch('httpError', e, {root: true});
        });
      });
    },
    newScript: function(context, payload) {
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
          // update my scripts
          context.dispatch('getMyScripts');
          resolve(result);
        })
        .catch(function (e) {
          context.dispatch('httpError', e, {root: true});
          reject(e);
        });
      });
    },
    updateScript: function(context, payload) {
      return new Promise((resolve, reject) => {
        const parameters = {
          scriptId: payload.scriptId,
          gamePackageName: payload.gamePackageName,
          displayName: payload.displayName,
          description: payload.description,
        };
        firebase.functions().httpsCallable('updateScript')(parameters)
        .then(function (result) {
          // update my scripts
          context.dispatch('getMyScripts');
          resolve(result);
        })
        .catch(function (e) {
          context.dispatch('httpError', e, {root: true});
          reject(e);
        });
      });
    },
    visibleScript: function(context, payload) {
      return new Promise((resolve, reject) => {
        const parameters = {
          scriptId: payload.scriptId,
          visible: payload.visible,
        };
        firebase.functions().httpsCallable('visibleScript')(parameters)
          .then(function (result) {
            // update my scripts
            // context.dispatch('getMyScripts');
            resolve(result);
          })
          .catch(function (e) {
            context.dispatch('httpError', e, { root: true });
            reject(e);
          });
      });
    },
    stableScriptVersion: function (context, payload) {
      return new Promise((resolve, reject) => {
        const parameters = {
          scriptId: payload.scriptId,
          version: payload.version,
        };
        firebase.functions().httpsCallable('stableScriptVersion')(parameters)
          .then(function (result) {
            // update my scripts
            context.dispatch('getMyScripts');
            resolve(result);
          })
          .catch(function (e) {
            context.dispatch('httpError', e, { root: true });
            reject(e);
          });
      });
    },
    newScriptVersion: function (context, payload) {
      return new Promise((resolve, reject) => {
        const storageRef = firebase.storage().ref();
        const scriptRef = storageRef.child(context.state.userId).child(payload.scriptId);
        const versionRef = scriptRef.child(String(payload.versionCode)).child('index.zip');
        versionRef.put(payload.file).then(function (snapshot) {
          console.log('Uploaded index.zip success');
          const parameters = {
            scriptId: payload.scriptId,
            description: payload.description,
          };
          firebase.functions().httpsCallable('newScriptVersion')(parameters)
          .then(function (result) {
            // update my scripts
            context.dispatch('getMyScripts');
            resolve(result);
          })
          .catch(function (e) {
            context.dispatch('httpError', e, { root: true });
            reject(e);
          });
        }).catch(function(e) {
          context.dispatch('httpError', e, { root: true });
          reject(e);
        });
      });
    },
    getScriptVersion: function (context, payload) {
      return new Promise((resolve, reject) => {
        const parameters = {
          scriptId: payload.scriptId,
          versionCode: payload.versionCode,
        };
        firebase.functions().httpsCallable('getScriptVersion')(parameters)
          .then(function (result) {
            console.log(result.data);
            resolve(result.data);
          })
          .catch(function (e) {
            context.dispatch('httpError', e, { root: true });
            reject(e);
          });
      });
    },
  }
};