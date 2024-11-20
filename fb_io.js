var score;
var UID;


var databaseRef;
var UID;
/**************************************************************/
// fb_initialise()
// Initialize firebase, connect to the Firebase project.
// 
// Find the config data in the Firebase consol. Cog wheel > Project Settings > General > Your Apps > SDK setup and configuration > Config
//
// Input:  n/a
// Return: n/a
/**************************************************************/
function fb_initialise() {

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyC_YI2XkIRIFNFr3Ivxjd-5wx5kxAOyrj8",
    authDomain: "fir-rebuild-b3c92.firebaseapp.com",
    databaseURL: "https://fir-rebuild-b3c92-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fir-rebuild-b3c92",
    storageBucket: "fir-rebuild-b3c92.appspot.com",
    messagingSenderId: "187367274216",
    appId: "1:187367274216:web:c399d98ffaadb217befb5d"
  };
  // Initialize Firebase
  databaseRef = firebase.initializeApp(firebaseConfig);
  //let ref = firebase.database("https://ben-britton-12comp-default-rtdb.asia-southeast1.firebasedatabase.app/")
  // This log prints the firebase object to the console to show that it is working.
  // As soon as you have the script working, delete this log.
  console.log(firebase);

}


/**************************************************************/
// fb_helloWorld()
// Demonstrate a minimal write to firebase
// This function replaces the entire database with the message "Hello World"
// 
// This uses the set() operation to write the key:value pair "message":"Hello World"
// The ref('/') part tells the operation to write to the base level of the database "/"
// This means it replaces the whole database with message:Hello World
/**************************************************************/
function fb_clear() {
  console.log("fb_clear()");
  firebase.database().ref('/').set(
    {
    }
  );
}



function fb_reset() {
  console.log("Running fb_goodbye()")
  firebase.database().ref('/').set(
    {
      users: {
        mOXE9Ueh4ng4ssf048Vn4bn9dSU2: {
          name: "Ben Britton",
          scores: {
            game1: 3,
            game2: 74
          }
        },
        asjB2op495Hsdfu34JFpasdmei39: {
          name: "Dwayne J",
          scores: {
            game1: 300,
            game2: 7400
          },
        }
      },
      highScores: {
        game1: {
          "Dwayne J": 300,
          "Ben Britton": 30,
          "Patrick": 30,
          "Spongebob": 13,
          "Gary": 31,
        },
        game2: {
          "Dwayne J": 7400,
          "Ben Britton": 74
        }
      }
    }
  )
}
/**************************************************************/
//  Authentication functions.
//  fb_authenticate handles the Google login. It is passed a
//  function to run once the Google login is complete
/**************************************************************/

function fb_authenticate(_DOTHIS){
  console.log("Handling the Google login")

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      //If user is already logged in, check that they have registered for the site
      console.log("logged in")
      //console.log(user.uid)
      _DOTHIS(user.uid, user.displayName)
    } else {
      console.log("Not logged in")
      // User is signed out
      // Using a popup.
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        console.log("signInWithPopup")
        
        // This gives you a Google Access Token.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        _DOTHIS(user.uid, user.displayName)
      });
    }
  });
}







/**************************************************************/
// fb_login()
// Use Google's login
// This function reads the current value from the 'message' field once
//
//
/**************************************************************/

function fb_login() {
  console.log("logging in")

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("logged in")
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User    
      /*sessionStorage.userData = {
        uid: user.uid,
        name: user.displayName,
      };*/
      // ...
      UID = user.uid;
      console.log(user.uid)
      //fb_setUID(user.uid)

    } else {
      console.log("Not logged in")
      // User is signed out
      // Using a popup.
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;

        //fb_setUID(user.uid)

      });
    }
  });
}


function fb_readScore() {
  var readPath = 'users/'+UID+"/scores/game1";

  console.log("fb_readScore: reading "+readPath)
  databaseRef.database().ref(readPath).once('value', fb_logDatabaseRead, fb_error)
  function fb_logDatabaseRead(snapshot) {
    console.log("You have "+snapshot.val().score + " points")
  }
}

function fb_writeScore() {
  var writePath = 'users/'+UID+"/scores/game1";
  console.log("fb_writeScore: writing "+score+" to "+writePath)

  firebase.database().ref(writePath + '/score').set(score);
}

function fb_getPoint() {
  if (score) {
    score++;
  } else {
    score = 1;
  }
  console.log("You have "+score+" points")
}
function fb_checkUser() {
console.log("fb_checkUser - your UID is:")
console.log(UID)
}





























/**************************************************************/
// fb_readMessageOnce()
// Demonstrate a minimal read from firebase
// This function reads the current value from the 'message' field once
//
//
/**************************************************************/
function fb_readOnce() {
  console.log("Read Once")
  firebase.database().ref('/highScores/game1').orderByValue().limitToLast(3).once('value', fb_logDatabaseRead, fb_error)
}
function fb_logDatabaseRead(snapshot) {
  snapshot.forEach(DO_THIS)

  function DO_THIS(childSnapshot) {
    console.log(childSnapshot.key + " " + childSnapshot.val())
  }
}
//




/*
function fb_logDatabaseRead(snapshot){
  if (snapshot.val()==null){
    console.log ("There was no data, the values are null.");
  }else{
    console.log (snapshot.val());
  }
}
*/
function fb_readListener() {
  console.log("Read Listener");
  firebase.database().ref('/message').on('value', fb_logDatabaseRead)
}

function fb_error(error) {
  console.log("fb_error");
  console.log(error)
}

/**************************************************************
// fb_readHighScores()
// Read and process the whole high score path
**************************************************************/

function fb_readHighScores() {
  console.log("Reading High scores");
  //https://firebase.google.com/docs/database/web/lists-of-data
  firebase.database().ref('/highScores/game1').orderByValue().once('value', fb_displayHighScores, fb_error);


  //  firebase.database().ref('/highScores/game1').once('value', fb_displayHighScores, fb_error);


  // firebase.database().ref('/highScores/game1').once('value', fb_displayHighScores, fb_error);

}

function fb_displayHighScores(snapshot) {
  let highScores = snapshot.val()
  snapshot.forEach(ARGH)
  // console.log(highScores);
  /*
  let names = Object.keys(highScores);
  console.log(names);
  for(let i = 0; i < names.length;i++){
    let key = names[i];
    console.log("Score "+i+" is for "+names[i]+". "+highScores[names[i]].score+" points.");
  }*/
  function ARGH(child) {
    console.log(child.val());
  }
}

function DO_THIS(snapshot) {
  console.log(snapshot.val());
  console.log(snapshot.val()["Ben Britton"])

  let scoreObject = {
    "Dwayne J": 300,
    "Ben Britton": 3
  }

}


/**************************************************************/
// fb_readMessageOn()
// Demonstrate a minimal listener for firebase
// This function sets up a listener for the 'message' field.
// It will immediately run the appropriate callback.
// It will run the appropriate callback whenever the 'message' field is changed
// If the read is successful it will call the fb_readOK function
// If the read is not successful it will call the FB_readError function
// Input:  n/a
// Return: n/a
/**************************************************************/
function fb_readMessageOn() {
  //database.ref('/message').on('value', fb_readOK, fb_readError);
  database.ref('/message').on('value').then(fb_readOK).catch(fb_readError);
  //firebase.database().ref('/').child('message').on('value').then(fb_readOK).catch(fb_readError);
  //firebase.database().ref('/').child('message').on('value').then(fb_readOK).catch(fb_readError);
}


function fb_readGet() {
  database.ref("/").child("message").get('value').then(fb_readOK).catch(fb_readError);
  //const dbRef = firebase.database().ref();
  //dbRef.child("message").get('value').then(fb_readOK).catch(fb_readError);
  //dbRef.child("message").get(fb_readOK, fb_readError)

  /*
dbRef.child("message").get().then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});*/
}







/*-----------------------------------------*/
// fb_readOK is a callback function. It will run when the database read has finished
// the database call will pass a snapshot of the data to fb_readOK
// Input:  data returned from firebase
/*-----------------------------------------*/
function DO_THIS(snapshot) {
  var dbData = snapshot.val();
  if (dbData == null) {
    console.log('There was no record when trying to read the message');
  }
  else {
    console.log("The message is: " + dbData)
    console.log(dbData)
  }
}

/*-----------------------------------------*/
// fb_readError(error)
// DB read record failed
// Input:  error message returned from firebase
/*-----------------------------------------*/
function fb_readError(error) {
  console.log("There was an error reading the message");
  console.error(error);
}