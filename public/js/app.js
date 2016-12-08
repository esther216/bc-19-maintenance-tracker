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
	var facilityRef = db.ref('facilities');
	var requestRef = db.ref('requests');

	var newUser= {};
	var newFacility = {};
	var newRequest = {};

	// function to generate random IDs
	function generateID(){
		var id = Math.random().toString(36).substring(2,7);
		return id;
	}

	//function to add a new row to a table
	function addRow(table, cols){
		var row = $('<tr/>');
		for( var i = 0; i < cols.length; i++){
			var col = $('<td/>').append(cols[i]);
			row.append(col);
		}
		table.append(row);
	}

	//function to add options to a select tag
	function addOptions(select, options){
		for( var i = 0; i < options.length; i++ ){
			select.append($('<option>', {
				value: i + 1,
				text: options[i]
			}));
		}
	}
	
	$(document).ready(function(){

		function displayAllFacilities(){
			var table = $('#all-facilities');
			var select = $('#report > div > div > div > select');
			var options = [];
			facilityRef.once('value', function(snapshot){
				
				var obj = snapshot.val();
				var i = 1;
				for ( var key in obj ){

					var data = [i];
					data.push(obj[key].id);
					data.push(obj[key].name);
					options.push(obj[key].name);
					data.push(obj[key].location)

					addRow(table, data);

					i++;
				}
				addOptions(select, options);
			});
			
		}

		function displayAllRequests(){
			var table = $('#requests > table');
			requestRef.once('value', function(snapshot){
				var obj = snapshot.val();
				var i = 1;
				
				for ( var key in obj ){
					var data = [i];
					data.push(obj[key].facility.name);
					data.push(obj[key].description);
					data.push(obj[key].approval);
					data.push(obj[key].resolved);

					addRow(table, data);
					i++;
				}
			
			});
		}

		displayAllFacilities();
		displayAllRequests();

		$('#sign-up-btn').click(function(){
			newUser.name = $('.modal-body > div > #fname').val();
			newUser.email = $('.modal-body > div > #email').val();
			newUser.password = $('.modal-body > div > #password').val();
			newUser.role= $('.modal-body > #role input[name=role]:checked').val();
			
			// create user on firebase
			firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
			.then( function(user){
				newUser.id = user.uid;
				usersRef.push(newUser);
				$(this).attr('data-dismiss', 'modal');
			})
			.catch( function(error){
				console.log(error);
			});
		});	

		$('#sign-in-btn').click( function(){
			var email = $('#sign-in > div > div > .md-form > #email').val();
			var password = $('#sign-in > div > div > .md-form > #password').val();
			var data;

			// Authenticate user
			firebase.auth().signInWithEmailAndPassword(email, password)
			.then( function(currentUser){
				var userId = currentUser.email;
				var filter = usersRef.orderByChild("email").equalTo(userId);
				filter.once('value', function(snapshot){
					var obj = snapshot.val();
					for ( var key in obj ) {
						data = obj[key];
					}
					if ( data.role === "admin" ){
						window.location.href= "/admin";
					}
					if ( data.role === "member" ){
						window.location.href= "/member";
					}
				});
			}, function(error){
				console.log(error.code);
				console.log(error.message);
			});
		});
	});

	// add a facility
	$('#facility-btn').click( function(){
		var table = $('#all-facilities');
		var data = [];
		var numberOfRows = $('#all-facilities > tbody > tr').length;
		
		data[0] = numberOfRows + 1;
		newFacility.id = generateID();
		newFacility.name = $('.modal-body > div > #facility-name').val();
		newFacility.location = $('.modal-body > div > #facility-location').val();
		
		facilityRef.push(newFacility);
		data.push(newFacility.id);
		data.push(newFacility.name);
		data.push(newFacility.location);
		addRow(table, data);
		$(this).attr('data-dismiss', 'modal');
	});


	// report a case / send a request
	$('#report-btn').click(function(){
		var selected = $('#report > div > div > div > select option:selected').text();
		var description = $('#description').val();
		var filter = facilityRef.orderByChild("name").equalTo(selected);
		newRequest.approval = "awaiting";
		newRequest.description = description;
		newRequest.resolved = "";
		
		filter.on('value', function(snapshot){
			snapshot.forEach(function(childSnapshot){
				newRequest["facility"] = childSnapshot.val();
				requestRef.push(newRequest);
			});
		});	
	});

})();