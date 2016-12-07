(function(){

	var config = {
	  apiKey: "AIzaSyCic31NC__5P22dEgpoheCGHDm1AdzXRvw",
	  authDomain: "maintenance-tracker-7a4ab.firebaseapp.com",
	  databaseURL: "https://maintenance-tracker-7a4ab.firebaseio.com",
	  storageBucket: "maintenance-tracker-7a4ab.appspot.com",
	  messagingSenderId: "431123767174"
	};
	firebase.initializeApp(config);

	var db = firebase.database();
	var usersRef= db.ref('users');


	var newUser= {};
	$(document).ready(function(){
		$('#sign-up-btn').click(function(){
			newUser.name = $('.modal-body > div > #fname').val();
			newUser.email = $('.modal-body > div > #email').val();
			newUser.password = $('.modal-body > div > #password').val();
			newUser.role= $('.modal-body > #role input[name=role]:checked').val();
			
			// create user on firebase
			firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
			.then(function(user){
				newUser.id = user.uid;
				usersRef.push(newUser);
				$('#sign-up').fadeOut(1000);
			})
			.catch(function(error){
				console.log(error);
			});
		});	

		$('#sign-in-btn').click(function(){
			var email = $('#sign-in > div > div > .md-form > #email').val();
			var password = $('#sign-in > div > div > .md-form > #password').val();
			var data;

			// Authenticate user
			firebase.auth().signInWithEmailAndPassword(email, password)
			.then(function(currentUser){
				var userId= currentUser.email;
				var filter = usersRef.orderByChild("email").equalTo(userId);
				filter.once('value', function(snapshot){
					var obj = snapshot.val();
					for (var key in obj) {
						data = obj[key];
					}
					if(data.role === "admin"){
						window.location.href= "/admin";
					}
					if(data.role === "member"){
						window.location.href= "/member";
					}
				});
			}, function(error){
				console.log(error.code);
				console.log(error.message);
			});
		});
	});

	
})();