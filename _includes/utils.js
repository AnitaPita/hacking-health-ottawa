<script type="text/javascript">

	function showAlert (title, desc){
		return vex.dialog.alert('<h3><strong>' + title + '</strong></h3><p>' + desc + '</p>');
	}

	function extractQuillContent(s) {
		var span= document.createElement('span');
		span.innerHTML= s;
		return span.firstChild.innerHTML;
	};

	function getCurrentParsedDate() {
		var monthNames = ["January", "February", "March", "April", "May", "June",
  		"July", "August", "September", "October", "November", "December"];

		var d = new Date();
		var monthString = monthNames[d.getMonth()];
		var hour = d.getHours();
		var meridian = "AM";
		if(hour>12)
		{
			hour -= 12;
			meridian = "PM";
		}
		else if(hour<1)
		{
			hour += 12;
		}

		return monthString+" "+d.getDate()+", "+d.getFullYear()+" at "+hour+":"+d.getMinutes()+ " " + meridian;
		document.write("The current month is " + monthNames[d.getMonth()]);
	}
    
	String.prototype.replaceAll = function(search, replacement) {
	    var target = this;
	    return target.replace(new RegExp(search, 'g'), replacement);
	};

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