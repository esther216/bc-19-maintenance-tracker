(function(){
	var config = {
	  apiKey: "AIzaSyCic31NC__5P22dEgpoheCGHDm1AdzXRvw",
	  authDomain: "maintenance-tracker-7a4ab.firebaseapp.com",
	  databaseURL: "https://maintenance-tracker-7a4ab.firebaseio.com",
	  storageBucket: "maintenance-tracker-7a4ab.appspot.com",
	  messagingSenderId: "431123767174"
	};

	firebase.initializeApp(config);

	// initialise database and refs
	var db = firebase.database();
	var usersRef= db.ref('users');
	var facilityRef = db.ref('facilities');
	var requestRef = db.ref('requests');

	function generateFacilityID(){
		var id = Math.random().toString(36).substring(2,7);
		return id;
	}

	function loadUserPage(role){
		if ( role === "admin" ){
			window.location = '/admin';
		}
		if ( role === "member"){
			window.location = '/member';
		}
	}

	function addNewRow(table, cols){
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
				})
			);
		}
	}

	function displayFacility(index, facility){
		var facilityTable = $('#all-facilities');
		var data = [index, facility.id, facility.name, facility.location];
		addNewRow(facilityTable, data);
	}

	function displayRequest(index, request){
		var requestTable = $('#requests > table');
		var row = $('<tr/>');
		var data = [
			index, request.facilityName, request.description, 
			request.approvalStatus, request.assignedStaff, 
			request.resolvedStatus
		];
		
		for( var i = 0; i < data.length; i++){
			var col = $('<td/>');
			col.append(data[i]);
			row.append(col);
		}
		requestTable.append(row);
		
	}

	function facilityOptions(facility){
		var select = $('#report > div > div > div > select');
		var data = [facility.name];
		addOptions(select, data);
	}

	$(document).ready(function(){

		//create objects
		var newUser= {};
		var newFacility = {};
		var newRequest = {};

		// create a user
		
		$('#sign-up-btn').click(function(){
			var elem = $(this);
			newUser.name = $('.modal-body > div > #fname').val();
			newUser.email = $('.modal-body > div > #email').val();
			newUser.password = $('.modal-body > div > #password').val();
			newUser.role= $('.modal-body > #role input[name=role]:checked').val();

			firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
			.then( function(user){
				newUser.id = user.uid;
				usersRef.push(newUser);
				loadUserPage(newUser.role);
			})
			.catch( function(error){
				console.log(error);
			});
		});

		// authenticate user sign in
		$('#sign-in-btn').click(function(){
			var email = $('#sign-in > div > div > .md-form > #email').val();
			var password = $('#sign-in > div > div > .md-form > #password').val();
			var details;

			firebase.auth().signInWithEmailAndPassword(email, password)
			.then(function(currentUser){
				var currentEmail = currentUser.email;
				var filter = usersRef.orderByChild("email").equalTo(currentEmail);
				filter.once('value', function(snapshot){
					var obj = snapshot.val();
					for ( var key in obj){
						details = obj[key];
					}
					loadUserPage(details.role);
					// display user details here
				});

			})
			.catch(function(error){
				console.log(error.code);
				console.log(error.message);
			});
		});

		$('#facility-btn').click( function(){
			var facilityTable = $('#all-facilities');
			
			var numberOfRows = $('#all-facilities > tbody > tr').length;
			
			var row = numberOfRows + 1;
			newFacility.id = generateFacilityID();
			newFacility.name = $('.modal-body > div > #facility-name').val();
			newFacility.location = $('.modal-body > div > #facility-location').val();
			
			facilityRef.push(newFacility);
			displayFacility(row, newFacility);
			$(this).attr('data-dismiss', 'modal');
		});

		// make or send a report/request

		$('#report-btn').click(function(){
			var selected = $('#report > div > div > div > select option:selected').text();
			var description = $('#description').val();
			var filter = facilityRef.orderByChild("name").equalTo(selected);
			newRequest.description = description;
			newRequest.approvalStatus = "awaiting";
			newRequest.assignedStaff = "none";
			newRequest.resolvedStatus = "pending";

			filter.once('value', function(snapshot){
				var obj = snapshot.val();
				var row = 1
				for ( var key in obj ){
					newRequest.facilityId = obj[key].id;
					newRequest.facilityName = obj[key].name;
					requestRef.push(newRequest);
					row++;
				}
			});

		});

		$('#sign-out-btn').click(function() {
			var user = firebase.auth();
			user.signOut().then(function() {
			  window.location = "/";
			}, function(error) {
			  console.error('Sign Out Error', error);
			});
			
		});

		function getAllUsers(){
			var select = $('#assign-staff > div > div > div > select');
			
			usersRef.once('value', function(snapshot){
				var obj = snapshot.val();
				for ( var key in obj ){
					if ( obj[key].role !== "admin"){
						addOptions(select, users);
					}
					
				}
			})
		}

		function getAllFacilities(){
			facilityRef.once('value', function(snapshot){
				var obj = snapshot.val();
				var row = 1;
				for ( var key in obj){
					var facility = obj[key];
					displayFacility(row, facility);
					facilityOptions(facility);
					row++;
				}
				
			});
		}

		function getAllRequests(){
			requestRef.on('value', function(snapshot){
				var obj = snapshot.val();
				var row = 1;
				for ( var key in obj ){
					var request = obj[key];
					displayRequest(row, request);
					row++;
				}

				
			});
		}

		getAllFacilities();	
		getAllRequests();
		
	});

})();