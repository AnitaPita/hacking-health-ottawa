<script type="text/javascript">
var storageRef = firebase.storage().ref();
var docName;

function getUserID() {
	return firebase.auth().currentUser.uid;
}

function createNewDocument(filename) {
	if(!isSignedIn()){return;}

	console.log("Creating document.");
}

function editDocument() {
	//Loads a previously edited document
	if(!isSignedIn()){return;}
	var docID = getURLParam().key;

	//If the docID doesn't exist, it's a new document, so we return.
	if (!docID)
		return;

	var userDocs = firebase.database().ref("private/" + getUserID() + "/documents/");
	userDocs.orderByKey().equalTo(docID).on("child_added" ,function(snapshot) {
		var title = snapshot.val().documentName;
    	var ref = snapshot.val().documentRef;
		document.getElementById("document-name").innerHTML = title;
		document.getElementById("editor").innerHTML = ref;
	});
}

function saveDocument(filename) {
	var uid = firebase.auth().currentUser.uid;
	var userRef = firebase.database().ref('private');

	var title = filename;
	userRef = userRef.child(uid);
	userRef = userRef.child("documents");
	var d = new Date();
	var dlm = d.getUTCMonth()+" "+d.getUTCDay()+", "+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes();

	userRef.push().set({
		docName : title,
		documentRef : ""	,
		dateLastModified : dlm,
		isPublished: false,
		publishedKey : "",
	})
	//TODO: redirect to home
	window.location = "/index.html";
}

function saveDocument(filename,privateKey) {
	var uid = firebase.auth().currentUser.uid;
	var userRef = firebase.database().ref('private');

	//var title = filename || document.getElementById("document-name").innerHTML;
	var documentRef = document.getElementById("editor").innerHTML;

	userRef = userRef.child(uid);
	userRef = userRef.child("documents");
	userRef = userRef.child()
	var d = new Date();
	var dlm = d.getMonth()+" "+d.getDay()+", "+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes();

	userRef.update({
		documentRef : documentRef,
		dateLastModified : dlm,
	});

	// userRef.push().set({
	// 	docName : title,
	// 	documentRef : documentRef,
	// 	dateLastModified : dlm,
	// })

	//TODO: redirect to edit
}

function publishDocument(filename) {
	var uid = firebase.auth().currentUser.uid;	
	var docRef = firebase.database().ref('public');

	var title = filename || document.getElementById("document-name").innerHTML;
	var documentRef = document.getElementById("editor").innerHTML;

	var dlm = d.getUTCMonth()+" "+d.getUTCDay()+", "+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes();

	docRef.push().set({
		documentName : title,
		documentRef : documentRef,
		author : uid,
		dateLastModified : dlm,
	})
	//return to home page with a success/fail.
}

</script>