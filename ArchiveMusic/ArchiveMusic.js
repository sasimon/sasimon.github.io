

					
		
		
		

$(document).ready( function() {
	//console.log($("#testDiv > div").width());
	$("#databaseControl").jqxExpander({
		toggleMode: "none",
		expanded: false
	});
	var loadXhr = new XMLHttpRequest();
	loadXhr.responseType = "arraybuffer";
	loadXhr.onload = function(e) {
		if (loadXhr.status != 200 && loadXhr.status != 304) {
			$("#databaseControl").jqxExpander("setHeaderContent","Database could not be loaded");
			return false;
		} else {
			var loadedArray = new Uint8Array (this.response);
			ArchiveMusic = new SQL.Database(loadedArray);
			ArchiveMusic.each("SELECT MAX(RecDate) FROM Dates",[], function (row) {
				;
			});
			$("#databaseControl").jqxExpander("setHeaderContent",'Database loaded successfully. <input id="downloadDatabase" type="button" value="Download Database" />');
			$("#downloadDatabase").jqxButton();
			$("#downloadDatabase").click( function() {
				var sendXhr = new XMLHttpRequest();
				sendXhr.open("POST","ArchiveMusic.php");
				var dbArray = ArchiveMusic.export();
				sendXhr.onload = function(e) {
					$("#databaseControl").jqxExpander("setContent",sendXhr.responseText);
					$("#databaseControl").jqxExpander("expand");
					if (sendXhr.responseText == "Content written successfully.") {
						window.setTimeout(function() {
							$("#databaseControl").jqxExpander("collapse");
						}, 10000);
					}
					var loadXhr2 =  new XMLHttpRequest;
					loadXhr2.open("GET","ArchiveMusic.sqlite");
					loadXhr2.responseType = "arraybuffer";
					loadXhr2.onload = function (e) {
						ArchiveMusic = new SQL.Database(new Uint8Array(this.response));
					};
					loadXhr2.send();
					;
					
				};
				sendXhr.send(dbArray);
				
			
				
			});
			// setupAlbums();
			ArchiveMusic.each("SELECT * from Albums",[],function (album) {
				albums.push(album);
			});
			ArchiveMusic.each("SELECT * from LocIDs",[],function (locID) {
				locIDs.push(locID.LocID);
			});
			$("#genres").css("display", "initial");
			appendGenres();
			$("#locations").css("display", "initial");
			$("#locations").jqxExpander({
				expanded: false
				});
			appendLocations();
			yearAndDates();
			$("#year").css("display","initial");
		}
		
	};
	loadXhr.open("GET","ArchiveMusic.sqlite");
	loadXhr.send();
});
