<script type="text/javascript">
var storageRef = firebase.storage().ref();
var docName;

function getUserID() {
	return firebase.auth().currentUser.uid;
}

/*function getUserRef() {
	return firebase.database().ref('private');
}*/

function createNewDocument(filename) {
	docTitle = filename;
	// create new codument
	// redirect to a create page
	if(!isSignedIn()){return;}
	console.log("Creating document.");
}

function editDocument(docID) {
	if(!isSignedIn()){return;}
	var userDocs = firebase.database().ref("private/"+getUserID());
	userDocs.equalTo(docID).once('value').then(function(snapshot) {
		var title = snapshot.val().docName;
    	var ref = snapshot.val().documentRef;
  });
}

function saveDocument(filename) {

	var uid = firebase.auth().currentUser.uid;
	var userRef = firebase.database().ref('private');

	var title = filename || document.getElementById("document-name").innerHTML;
	var documentRef = document.getElementById("editor").innerHTML;

	//console.log(userRef);
	userRef = userRef.child(uid);
	userRef = userRef.child("documents");

	userRef.push().set({
		docName : title,
		documentRef : documentRef,
	})
}

function publishDocument(filename) {
	var uid = firebase.auth().currentUser.uid;	
	var docRef = firebase.database().ref('public');

	var title = filename || document.getElementById("document-name").innerHTML;
	var documentRef = document.getElementById("editor").innerHTML;

	docRef.push().set({
		docName : title,
		documentRef : documentRef,
		author : uid,
	})
}

</script>