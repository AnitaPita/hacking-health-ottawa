<script type="text/javascript">
var quill;
var storageRef = firebase.storage().ref();
var docName;

function getUserID() {
	return firebase.auth().currentUser.uid;
}

function createNewDocument(filename) {
	if(!isSignedIn()){return;}

	console.log("Creating document.");
}

function initiateQuill () {
	quill = new Quill('#editor', {
	    theme: 'snow',
		modules: {
		  	toolbar: [
		    	[{ header: [1, 2, 3, false] }],
		    	['bold', 'italic', 'underline'],
		    	[{ 'list': 'ordered'}, { 'list': 'bullet' }],
		    	[{ 'script': 'sub'}, { 'script': 'super' }, { 'align': [] }],
		    	[{ 'indent': '-1'}, { 'indent': '+1' }],
		    	['blockquote', 'image', 'link']
		    ]
		},
	});
}
function editDocument() {
	//Loads a previously edited document
	if(!isSignedIn()){return;}
	var docID = getURLParam().key;

	//If the docID doesn't exist, it's a new document, so we return.
	if (!docID) {
		initiateQuill();
		return;
	}

	var userDocs = firebase.database().ref("private/" + getUserID() + "/documents/");
	userDocs.orderByKey().equalTo(docID).on("child_added" ,function(snapshot) {
		var title = snapshot.val().documentName;
    	var ref = snapshot.val().documentRef;
		document.getElementById("document-name").innerHTML = title;
		document.getElementById("editor").innerHTML = ref;
		initiateQuill();
	});
}

function saveExistingDocument(filename, privateKey) {
	console.log ("Editing an existing document");
	var uid = firebase.auth().currentUser.uid;
	var userRef = firebase.database().ref('private');

	//var title = filename || document.getElementById("document-name").innerHTML;
	var documentRef = document.getElementById("editor").firstChild.innerHTML;

	userRef = userRef.child(uid);
	userRef = userRef.child("documents");
	userRef = userRef.child(privateKey);
	var d = new Date();
	var dlm = d.getMonth()+" "+d.getDay()+", "+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes();

	userRef.update({
		documentRef : documentRef,
		dateLastModified : dlm,
	});
}

function saveNewDocument(filename) {
	console.log("Saving a new document");

	var uid = firebase.auth().currentUser.uid;
	var userRef = firebase.database().ref('private');

	var title = filename;
	userRef = userRef.child(uid);
	userRef = userRef.child("documents");
	var d = new Date();
	var dlm = d.getUTCMonth()+" "+d.getUTCDay()+", "+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes();
	var documentRef = document.getElementById("editor").innerHTML;

	var newDocRef = userRef.push();
	console.log(newDocRef.key);

	newDocRef.set({
		documentName : title,
		documentRef : documentRef,
		dateLastModified : dlm,
		isPublished: false,
		publishedKey : "",
	})
	
	window.history.pushState(null,null,"/edit.html?filename="+encodeURI(filename)+"&key="+newDocRef.key);

	return newDocRef.key;
}

function saveHandler (){
	var documentName = document.getElementById('document-name').innerHTML;
	var key = getURLParam().key;
	if (!key)
		saveNewDocument (documentName);
	else
		saveExistingDocument (documentName, key);
}

function getUserDocuments (divId) {
	var uid = firebase.auth().currentUser.uid;

	//Iterates through all saved documents
	var query = firebase.database().ref('private/' + uid + '/documents/').orderByKey();
	query.once("value").then(function(snapshot) {
		var mergedHTML = '';
		var noDocuments = 0;
		snapshot.forEach(function(childSnapshot){
			noDocuments++;
			var documentName = childSnapshot.val().documentName;
			var documentKey = childSnapshot.key;
			var dateLastModified = childSnapshot.val().dateLastModified;
			mergedHTML += "<div class='member-documents__document'><div class='member-documents__document-name'><a class='member-document__link' href='/edit.html?filename=" + encodeURI(documentName) + "&key=" + documentKey + "'>" + documentName + "</a></div><div class='member-documents__date'>" + dateLastModified + "</div></div>";
		});
		document.getElementById(divId).innerHTML = mergedHTML;
	});
}

function publishHandler (){
	var documentName = document.getElementById('document-name').innerHTML;
	var key = getURLParam().key;
	if (!key)
		console.log("couldn't find private key, creating new document");
		key = saveNewDocument(documentName);
		console.log("Key is:" + key);
		
	console.log("handler says: "+documentName);
	publishDocument (documentName, key);
}

function publishDocument(filename, privateKey) {
	console.log("Publishing a document");
	//var privateKey = getURLParam().key;
	var uid = firebase.auth().currentUser.uid;
	var userRef = firebase.database().ref('public');

	var title = filename;

	firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
					var firstName = snapshot.val().firstName;
					var lastName = snapshot.val().lastName;

					var author = firstName+" "+lastName;
	var d = new Date();
	var dlm = d.getUTCMonth()+" "+d.getUTCDay()+", "+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes();
	var documentRef = document.getElementById("editor").innerHTML;

	//Create a new published document.
	console.log(title);
	console.log(privateKey);
	userRef.push().set({
		documentName : title,
		documentRef : documentRef,
		dateLastModified : dlm,
		author : author,
		isPublished: true,
		privateKey : privateKey,
	})
	});

	
	//return to home page with a success/fail.
}

</script>