var firebaseConfig = {
    apiKey: "AIzaSyB-EEYFZZe4eNJdzQHkttvK7FSNmDKKnN8",
    authDomain: "my-league-app.firebaseapp.com",
    databaseURL: "https://my-league-app.firebaseio.com",
    projectId: "my-league-app",
    storageBucket: "my-league-app.appspot.com",
    messagingSenderId: "978221051084",
    appId: "1:978221051084:web:bfbfc817d28f122e2aa669"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  function loadLeagues() {
    db.collection('leagues').get()
            .then(querySnapshot => {
                querySnapshot.forEach( (doc) => {
                    console.log(`${doc.id}`);
                });
            })
            .catch(err => {
                console.log("Error has occured: " + err);
            });
  }

  $(document).ready(function() {
    console.log("Document ready from JQuery");
    loadLeagues();
});