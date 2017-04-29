<script type="text/javascript">
var storageRef = firebase.storage().ref();
var accountJustCreated = false;

function isSignedIn () {
	return (firebase.auth().currentUser);
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
				vex.dialog.alert('<h3><strong>Wrong Password</strong></h3><p>You have entered an incorrect password.</p>')
			else
				vex.dialog.alert('<h3><strong>Something went wrong</strong></h3><p>' + errorMessage + '</p>');
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
		vex.dialog.alert('<h3><strong>Passwords do not Match</strong></h3><p>Please try again.</p>');
		return;
	}
    if (email.length < 4) {
    	vex.dialog.alert('<h3><strong>Enter an Email Address</strong></h3><p>Please enter an email address.</p>');
        return;
    }
	if (password.length < 7) {
		vex.dialog.alert('<h3><strong>Weak Password</strong></h3><p>Please ensure that your password is at least 7 characters.</p>')
		return;
	}

	// Sign in with email and pass.
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		if (errorCode == 'auth/weak-password')
			vex.dialog.alert('<h3><strong>Weak Password</strong></h3><p>The password is too weak.</p>')
		else
			vex.dialog.alert('<h3><strong>Something went wrong</strong></h3><p>' + errorMessage + '</p>');
	});
	vex.dialog.alert('<h3><strong>Account Successfully Created</strong></h3><p>Your account has successfully been created! You are now logged in. Welcome to the CFMS!</p>')
	accountJustCreated = true;
}

function sendPasswordReset() {
	var email = document.getElementById('reset-email-address').value;
	firebase.auth().sendPasswordResetEmail(email).then(function() {
		// Password Reset Email Sent!
		vex.dialog.alert('<h3><strong>Password Reset Email Sent</strong></h3><p>Your Password Reset Email has been sent. Please check your inbox.</p>')
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;

		if (errorCode == 'auth/invalid-email')
			vex.dialog.alert('<h3><strong>Invalid Email</strong></h3><p>The email address that you entered is invalid.</p>')
		else if (errorCode == 'auth/user-not-found')
			vex.dialog.alert('<h3><strong>User Not Found</strong></h3><p>The email address that you entered does not match a user on our system.</p>')
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
			var medicalSchool = document.getElementById('account-medical-school').value;
			var graduationYear = document.getElementById('account-graduation-year').value;
			firebase.database().ref('users/' + user.uid).set({
			    firstName: firstName,
			    lastName: lastName,
			})
			accountJustCreated = false;
		}

		if (user) {
			// User is signed in.
			document.getElementById('login-button').textContent = 'Logout';
			//document.getElementById('members').style.display = 'inline';

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
			//document.getElementById('members').style.display = 'none';

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