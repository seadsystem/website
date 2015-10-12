/*! Made by Bryan
*/

/*!
<html>
<input type="file" id="files" name="files[]" multiple/><br><br>

<script src="jquery.js"></script>
*/

/*!
function handleFileSelect(evt) {
   var files = evt.target.files; // FileList object
   for (var i = 0, f; f = files[i]; i++) {
      parseFile(f);
   }
}
document.getElementById('files').addEventListener('change', handleFileSelect, false);
*/

if (!window.File) {
   console.log("no file support"); // no file support
}

function parseFile(f) {
   var reader = new FileReader();
   reader.onload = function(e) {
      parsed = new DOMParser().parseFromString(this.result, "text/xml");
      var intervals = $("IntervalReading", parsed);
      var usageTable = [];
      for (i=0;i<intervals.size();i++) {
         avgTime = $("duration",intervals[i]).html()/2;
         startTime = $("start",intervals[i]).html()/1;
         usage = $("value",intervals[i]).html()/1000;
         usageTable[i] = [(startTime+avgTime)*1000, usage];
      }
      console.log(usageTable);
   }
   reader.readAsText(f, "text/xml");
}
