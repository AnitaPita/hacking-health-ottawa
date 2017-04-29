<script type="text/javascript">
var storageRef = firebase.storage().ref();
var accountJustCreated = false;

function isSignedIn () {
	return (firebase.auth().currentUser);
}

function showAlert (title, desc){
	return vex.dialog.alert('<h3><strong>' + title + '</strong></h3><p>' + desc + '</p>');
}

/**
 * Gets a URL parameter sent with GET
 */
function getURLParam(url) {
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  var obj = {};

  //Parses everything after the ? delimiter
  if (queryString) {
    queryString = queryString.split('#')[0];
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

      // If parameter name already exists
      if (obj[paramName]) {
        // Convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // If no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }
  return obj;
}

/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
	if (firebase.auth().currentUser){
		firebase.auth().signOut();
	}
	else {
		var email = document.getElementById('login-email').value;
		var password = document.getElementById('login-password').value;

		// Sign in with email and pass.
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;

			if (errorCode === 'auth/wrong-password')
				showAlert ('Wrong Password', 'You have entered an incorrect password.');
			else
				showAlert ('Something went wrong', errorMessage);
			document.getElementById('login-button').disabled = false;
		});
	}
	document.getElementById('login-button').disabled = true;
}

/**
 * Handles the sign up button press.
 */
function handleSignUp() {
	var email = document.getElementById('account-email').value;
	var password = document.getElementById('account-password-first').value;
	var passwordAgain = document.getElementById('account-password-second').value;
	if (password !== passwordAgain){
		showAlert ('Passwords do not Match', 'Please try again.')
		return;
	}
    if (email.length < 4) {
    	showAlert ('Enter an Email Address', 'Please enter an email address.')
        return;
    }
	if (password.length < 7) {
		showAlert ('Weak Password', 'Please ensure that your password is at least 7 characters.')
		return;
	}

	// Sign in with email and pass.
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		if (errorCode == 'auth/weak-password')
			showAlert ('Weak Password', 'The password is too weak');
		else
			showAlert ('Something went wrong', errorMessage);
	});
	showAlert ('Account Successfully Created', 'Your account has successfully been created! You are now logged in. We hope you enjoy using {{ site.data.values.app_name }}')
	accountJustCreated = true;
}

function sendPasswordReset() {
	var email = document.getElementById('reset-email-address').value;
	firebase.auth().sendPasswordResetEmail(email).then(function() {
		// Password Reset Email Sent!
		showAlert ('Password Reset Email Sent', 'Your Password Reset Email has been sent. Please check your inbox.');
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;

		if (errorCode == 'auth/invalid-email')
			showAlert ('Invalid Email', 'The email address that you entered is invalid.')
		else if (errorCode == 'auth/user-not-found')
			showAlert ('User Not Found', 'The email address that you entered does not match a user on our system.')
	});
}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
	// Listening for auth state changes.
	firebase.auth().onAuthStateChanged(function(user) {

		if (accountJustCreated){
			var firstName = document.getElementById('account-first-name').value;
			var lastName = document.getElementById('account-last-name').value;
			firebase.database().ref('users/' + user.uid).set({
			    firstName: firstName,
			    lastName: lastName,
			})
			accountJustCreated = false;
		}

		if (user) {
			// User is signed in.
			document.getElementById('login-button').textContent = 'Logout';
			document.getElementById('members').style.display = 'inline-block';
			document.getElementById('create').style.display = 'inline-block';

			//Show all member-only elements
			var memberElements = document.getElementsByClassName('members-only'), i;
			for (var i = 0; i < memberElements.length; i ++)
				memberElements[i].style.display = 'block';
			//Hide all non-member elements
			var nonMemberElements = document.getElementsByClassName('non-members'), i;
			for (var i = 0; i < nonMemberElements.length; i ++)
				nonMemberElements[i].style.display = 'none';
			//Show admin elements if is admin
			firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
				if(snapshot.val().isAdmin === true){
					var adminElements = document.getElementsByClassName('admin-only'), i;
					for (var i = 0; i < adminElements.length; i ++)
						adminElements[i].style.display = 'block';
				}
			});
		} 
		else {
			// User is signed out.
			document.getElementById('login-button').textContent = 'Login';
			document.getElementById('members').style.display = 'none';
			document.getElementById('create').style.display = 'none';

			//Hide all member-only elements
			var memberElements = document.getElementsByClassName('members-only'), i;
			for (var i = 0; i < memberElements.length; i ++)
				memberElements[i].style.display = 'none';
			//Show all non-member elements
			var nonMemberElements = document.getElementsByClassName('non-members'), i;
			for (var i = 0; i < nonMemberElements.length; i ++)
				nonMemberElements[i].style.display = 'block';
			//Hide Admin Elements
			var adminElements = document.getElementsByClassName('admin-only'), i;
			for (var i = 0; i < adminElements.length; i ++)
				adminElements[i].style.display = 'none';
		}

		//Shows Member Account Information on the Members Page
		if (window.location.pathname == '/members/' 
			|| window.location.pathname == '/resources/md-leadership-awards-application.html'){
			if (user) {
				firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
					var firstName = snapshot.val().firstName;
					var lastName = snapshot.val().lastName;
					document.getElementById('account-name').textContent = firstName + ' ' + lastName;
					var accountEmail = document.getElementById('account-email');
					accountEmail.textContent = user.email;
					accountEmail.href = 'mailto:' + user.email;
				});
			} 
			else {
				document.getElementById('account-name').textContent = '';
				var accountEmail = document.getElementById('account-email');
				accountEmail.textContent = '';
				accountEmail.href = '';
			}
		}
		
	});
}

window.onload = function() {
	initApp();
};
</script>