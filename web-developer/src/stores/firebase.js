// firebase is existed
var FirebaseModule = {
  namespaced: true,
  state: {
    useLocalServer: true,
    firebaseConfig: {
      apiKey: "AIzaSyACUPUTU4UCe3AiGiWptceV_HtzSMwOFv4",
      authDomain: "robotmonstore.firebaseapp.com",
      databaseURL: "https://robotmonstore.firebaseio.com",
      projectId: "robotmonstore",
      storageBucket: "robotmonstore.appspot.com",
      messagingSenderId: "343212092969"
    },
    loginConfig: {
      signInSuccessUrl: 'http://localhost:8080',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      tosUrl: 'http://localhost:8080',
      privacyPolicyUrl: function () {
        window.location.assign('http://localhost:8080');
      },
    },
    loginUI: undefined,
    isLogin: false,
    user: undefined,
  },
  mutations: {
    setLoginUI: function(state, ui) {
      state.loginUI = ui;
    },
    login: function(state, user) {
      if (user == undefined) {
        return;
      }
      state.isLogin = true;
      state.user = user;
    },
    logout: function(state) {
      state.isLogin = false;
      state.user = undefined;
    }
  },
  actions: {
    initFirebase: function(context) {
      firebase.initializeApp(context.state.firebaseConfig);
      context.commit('setLoginUI', new firebaseui.auth.AuthUI(firebase.auth()));
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          context.commit('login', user);
          context
        } else {
          context.commit('logout');
        }
      }, function (error) {
        console.log(error);
      });
      if (context.state.useLocalServer) {
        firebase.functions().useFunctionsEmulator('http://localhost:5000');
      }
    },
    showLoginUI: function(context, containerId) {
      context.state.loginUI.start(containerId, context.state.loginConfig);
    },
    login: function() {
      // loginUI do this
    },
    logout: function() {
      firebase.auth().signOut();
    }
  }
};