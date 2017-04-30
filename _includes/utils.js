<script type="text/javascript">
	
	// var prependedEditorHTML  = "<div class='ql-editor' contenteditable='true'>";
	// var postpendedEditorHTML = "</div><div class='ql-clipboard' contenteditable='true' tabindex='-1'></div><div class='ql-tooltip ql-hidden'><a class='ql-preview' target='_blank' href='about:blank'></a><input type='text' data-formula='e=mc^2' data-link='https://quilljs.com' data-video='Embed URL'><a class='ql-action'></a><a class='ql-remove'></a></div>'";

	// /**
	//  * Adds the extra HTML needed for Quill's editing capabilities
	//  */
	// function getEditableHTML (HTML) {
	// 	return prependedEditorHTML + HTML + postpendedEditorHTML;
	// }

	function showAlert (title, desc){
		return vex.dialog.alert('<h3><strong>' + title + '</strong></h3><p>' + desc + '</p>');
	}

	function encodeURIRFC3986 (str) {  
	    return encodeURIComponent(str).replace(/[!'()*]/g, escape);  
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
</script>