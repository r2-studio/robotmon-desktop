var config = {
  apiKey: "AIzaSyBdoy4YKI6GNkpMygh15CvgA9j7X57Jv-4",
  authDomain: "robotmon-98370.firebaseapp.com",
  databaseURL: "https://robotmon-98370.firebaseio.com",
  projectId: "robotmon-98370",
  storageBucket: "robotmon-98370.appspot.com",
  messagingSenderId: "640484500823"
};
firebase.initializeApp(config);

function initApp() {
  console.log("Robotmon Messager");
  // Listen for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    console.log('User state change detected from the Background script of the Chrome Extension:', user);
  });
  chrome.runtime.onMessage.addListener(function(request) {
    if (request.type === 'signInGoogle') {
      startAuthGoogle();
    } else if (request.type === 'signInFacebook') {
      startAuthFacebook();
    }
  });
}

function startAuthGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().useDeviceLanguage();
  firebase.auth().signInWithPopup(provider).then(function(result) {
  }).catch(function(error) {
    console.log(error);
  });
}

function startAuthFacebook() {
  var provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().useDeviceLanguage();
  firebase.auth().signInWithPopup(provider).then(function(result) {
  }).catch(function(error) {
    console.log(error);
  });
}

window.onload = function() {
  initApp();
};