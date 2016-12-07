(function(){
	var config = {
	  apiKey: "AIzaSyCic31NC__5P22dEgpoheCGHDm1AdzXRvw",
	  authDomain: "maintenance-tracker-7a4ab.firebaseapp.com",
	  databaseURL: "https://maintenance-tracker-7a4ab.firebaseio.com",
	  storageBucket: "maintenance-tracker-7a4ab.appspot.com",
	  messagingSenderId: "431123767174"
	};
	firebase.initializeApp(config);

	var newUser= {};
	var facilities= firebase.database().ref('facilities');
	var requests = firebase.database().ref('requests');
	var admins = firebase.database().ref('users/admins');
	var members = firebase.database().ref('users/members');

	$(document).ready(function(){
		$('#sign-up-btn').click(function(){
			newUser.name = $('.modal-body > div > #fname').val();
			newUser.email = $('.modal-body > div > #email').val();
			newUser.password = $('.modal-body > div > #password').val();
			newUser.role= $('.modal-body > form').val();
			console.log(newUser.role);
		});

		$('#sign-in-btn').click(function(){
			alert("you signed in!");
		});
	});

	// User Authentication
	// document.getElementById('sign-in').addEventListener('click', function(){
	// 	var username= document.getElementById('uname').value;
	// 	var password= document.getElementById('pass').value;
		
	// 	firebase.auth().signInWithEmailAndPassword(username, password).then(function(){
	// 		console.log("Sign In was successful");
	// 		window.location = '/admin';
	// 	}, function(error){
	// 		console.log(error.code);
	// 		console.log(error.message);
	// 	});
	// });
})();