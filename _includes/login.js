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
			window.location = "/";
		}

		if (user) {
			// User is signed in.
			document.getElementById('login-button').style.display = 'none';
			document.getElementById('member').style.display = 'inline-block';
			firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
				var firstName = snapshot.val().firstName;
				var lastName = snapshot.val().lastName;
				document.getElementById('member-name').textContent = firstName + ' ' + lastName + ' ▼';
			});
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
			document.getElementById('login-button').style.display = 'inline';
			document.getElementById('member').style.display = 'none';
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
		if (window.location.pathname == '/account.html'){
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
		
		//Displays user documents if logged in and in the right directory
		if (user && window.location.pathname == '/documents.html'){
			getUserDocuments ("member-documents");
		}
		//Loads a document if in the edit directory 
		if (user && window.location.pathname == '/edit.html'){
			editDocument ();
		}
	});
}

function getPublicDocuments (divId) {
	//Iterates through all saved documents
	var query = firebase.database().ref('public/').orderByKey();
	query.once("value").then(function(snapshot) {
		var mergedHTML = '';
		var noDocuments = 0;
		snapshot.forEach(function(childSnapshot){
			noDocuments++;
			var documentName = childSnapshot.val().documentName;
			var documentAuthor = childSnapshot.val().author;
			var documentKey = childSnapshot.key;
			var dateLastModified = childSnapshot.val().dateLastModified;
			mergedHTML += "<div class='public-documents__document'><div class='public-documents__document-name'><a class='public-documents__link' href='/view.html?filename=" + encodeURI(documentName) + "&key=" + documentKey + "&author=" + encodeURI(documentAuthor) + "&datemodified=" + encodeURI(dateLastModified) + "'>" + documentName + "</a></div><div class='member-documents__date'>" + dateLastModified + "</div><div class='public-documents__author'>" + documentAuthor + "</div></div>";
		});
		document.getElementById(divId).innerHTML = mergedHTML;
	});
}

window.onload = function() {
	initApp();
};
</script>