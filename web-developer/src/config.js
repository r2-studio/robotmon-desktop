var firebaseConfig = {
  apiKey: "AIzaSyACUPUTU4UCe3AiGiWptceV_HtzSMwOFv4",
  authDomain: "robotmonstore.firebaseapp.com",
  databaseURL: "https://robotmonstore.firebaseio.com",
  projectId: "robotmonstore",
  storageBucket: "robotmonstore.appspot.com",
  messagingSenderId: "343212092969"
};
firebase.initializeApp(firebaseConfig);

var uiConfig = {
  signInSuccessUrl: 'http://localhost:8080',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  tosUrl: 'http://localhost:8080',
  privacyPolicyUrl: function () {
    window.location.assign('http://localhost:8080');
  }
};
var loginUI = new firebaseui.auth.AuthUI(firebase.auth());
// global:firebaseConfig, firebase, uiConfig and loginUI