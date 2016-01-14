function removeParentsAndChildren (combobox, value) {
	ArchiveMusic.each("WITH RECURSIVE Parents (Parent) AS (SELECT Parent FROM GenreParent WHERE Genre = ? UNION SELECT GenreParent.Parent FROM GenreParent JOIN Parents ON Parents.Parent = GenreParent.Genre) SELECT * FROM Parents",
	[value],
	function (row) {
		$(combobox).jqxComboBox("removeItem", row.Parent);
	});
	ArchiveMusic.each("WITH RECURSIVE Children (Child) AS (SELECT Genre FROM GenreParent WHERE Parent = ? UNION SELECT Genre FROM GenreParent JOIN Children ON Child = Parent) SELECT * FROM Children",
	[value],
	function (row) {
		$(combobox).jqxComboBox("removeItem", row.Child);
	});
}
function onAlbumChange(event) {
	if(event.target != document.getElementById("discInput")) {
		albumEditing = true;
		$("#yearInput, #albumInput").jqxNumberInput({disabled: true});
		$("#commitAlbum, #rollbackAlbum").jqxButton({disabled: false});
	}
}
function setupAlbums() {
	$("#albumInput").jqxNumberInput({
		min: 1,
		max: 999,
		spinButtons: true,
		inputMode: "simple",
		decimal: 1,
		decimalDigits: 0
	});
	$("#commitAlbum, #rollbackAlbum").jqxButton({disabled: true});
	$("#commitAlbum").click(function() {
		var dateToSubmit = $("#albumDateInput").jqxDateTimeInput("val","date");
		dateToSubmit.setUTCHours(0,0,0,0);
		var paramArray = [$("#yearInput").jqxNumberInput("getDecimal"), $("#albumInput").jqxNumberInput("getDecimal")]
		ArchiveMusic.run("DELETE FROM TrackArtistsView WHERE RecYear = ? AND Album = ?", paramArray);
		ArchiveMusic.run("DELETE FROM TracksView WHERE RecYear = ? AND Album = ?", paramArray);
		ArchiveMusic.run("DELETE FROM AlbumGenreView WHERE RecYear = ? AND Album = ?", paramArray);
		ArchiveMusic.run("DELETE FROM ArtistsView WHERE RecYear = ? AND Album = ?", paramArray);
		ArchiveMusic.run("DELETE FROM AlbumsView WHERE RecYear = ? AND Album = ?", paramArray);
		ArchiveMusic.run("INSERT INTO AlbumsView VALUES (:RecYear, :Album, :RecDate, :Location, :OtherLocation)",{
			":RecYear": paramArray[0],
			":Album": paramArray[1],
			":RecDate": dateToSubmit.toISOString(),
			":Location": $("#albumLocationInput").jqxComboBox("val"),
			":OtherLocation": $("#otherLocation").val()
		});
		for (var i = 0; i < artists.length; i++) {
			ArchiveMusic.run("INSERT INTO ArtistsView VALUES (:RecYear, :Album, :SeqNo, :Artist)", {
				":RecYear": paramArray[0],
				":Album": paramArray[1],
				":SeqNo": artists[i].ArtistID + 1,
				":Artist": artists[i].Artist
			});
		}
		for (var i = 0; i < albumGenres.length; i++) {
			ArchiveMusic.run("INSERT INTO AlbumGenresView VALUES (:RecYear, :Album, :SeqNo, :Genre)", {
				":RecYear": paramArray[0],
				":Album": paramArray[1],
				":SeqNo": albumGenres[i].AlbumGenreID + 1,
				":Genre": albumGenres[i].Genre
			});
		}
		for (var i = 0; i < discs.length; i++) {
			for (var j = 0; j < discs[i].tracks.length; j++) {
				ArchiveMusic.run("INSERT INTO TracksView VALUES (:RecYear, :Album, :Disc, :Track, :Length, :Size, :Title)", {
					":RecYear": paramArray[0],
					":Album": paramArray[1],
					":Disc": i + 1,
					":Track": discs[i].tracks[j].Track,
					":Length": discs[i].tracks[j].Length,
					":Size": discs[i].tracks[j].Size,
					":Title": discs[i].tracks[j].Title
				});
			}
			for (var j = 0; j < discs[i].trackArtists.length; j++) {
				ArchiveMusic.run("INSERT INTO TrackArtistsView VALUES (:RecYear, :Album, :Disc, :Track, :SeqNo, :Artist)", {
					":RecYear": paramArray[0],
					":Album": paramArray[1],
					":Disc": i + 1,
					":Track": discs[i].trackArtists[j].Track,
					":SeqNo": discs[i].trackArtists[j].SeqNo,
					":Artist": discs[i].trackArtists[j].Artist
				});
			}
		}
		populateAlbum();
	});
	$("#rollbackAlbum").click(populateAlbum);
	$("#album, #albumDate, #albumLocation, #albumArtists, #albumGenres, #disc, #tracks, #trackArtists").jqxExpander({
		toggleMode: "none",
		showArrow: false
	});
	$("#albumDateInput").jqxDateTimeInput({
		formatString: "M/d",
		value: new Date(2004, 3, 1)
	});
	$("#editDates, #editLocations, #addArtist, #addAlbumGenre, #editGenres").jqxButton();
	$("#editDates").click( function() {
		$("#album").jqxExpander("collapse");
		$("#dates").jqxExpander("expand");
	});
	locationsByYear = [{
		LocID: "",
		LocationName: "Please select a location or type one in:"
	}];
	ArchiveMusic.each("SELECT Locations.LocID, coalesce(LocationName, '') AS LocationName FROM Locations WHERE ? BETWEEN StartYear AND coalesce(EndYear, CAST (strftime('%Y','now') AS INTEGER))", [$("#yearInput").jqxNumberInput("val")], function (row) {
		locationsByYear.push(row);
	});
	$("#albumLocationInput").jqxComboBox({
		source: locationsByYear,
		displayMember: "LocationName",
		valueMember: "LocID",
		selectedIndex: 0,
		width: "360px"
	});
	$("#otherLocation").jqxInput();
	$("#albumLocationInput").change( function() {
		$("#otherLocation").jqxInput({
			disabled: $("#albumLocationInput").jqxComboBox("val") != ""
		});
	});
	$("#editLocations").click(function() {
		$("#year").jqxExpander("collapse");
		$("#locations").jqxExpander("expand");
	});
	$("#albumArtistsTable").jqxGrid({
		editable: true,
		columns: [{
			text: "Artist",
			datafield: "Artist",
			columntype: "numberinput"
		},/*{
			text: "Shift Down",
			datafield: "ShiftArtistDown",
			columntype: "button",
			buttonclick: function (row) {
				if (row != $("#albumArtistsTable").jqxGrid("getrows").length - 1) {
					var shiftedArtist = $("#albumArtistsTable").jqxGrid("getcellvalue", row, "Artist");
					$("#albumArtistsTable").jqxGrid("setcellvalue", row, "Artist", $("#albumArtistsTable").jqxGrid("getcellvalue", row + 1, "Artist"));
					$("#albumArtistsTable").jqxGrid("setcellvalue", row + 1, "Artist", shiftedArtist);
					$("#albumArtistsTable").change();
				}
			}
		},{
			text: "Shift Up",
			datafield: "ShiftArtistUp",
			columntype: "button",
			buttonclick: function (row) {
				if (row != 0) {
					var shiftedArtist = $("#albumArtistsTable").jqxGrid("getcellvalue", row, "Artist");
					$("#albumArtistsTable").jqxGrid("setcellvalue", row, "Artist", $("#albumArtistsTable").jqxGrid("getcellvalue", row - 1, "Artist"));
					$("#albumArtistsTable").jqxGrid("setcellvalue", row - 1, "Artist", shiftedArtist);
					$("#albumArtistsTable").change();
				}
			}
		},{
			text: "Delete",
			datafield: "DeleteArtist",
			columntype: "button",
			buttonclick: function (row) {
				$("#albumArtistsTable").jqxGrid("deleterow", row);
				$("#albumArtistsTable").change();
			}
		}*/],
		source: artistsSource
	});
	$("#addArtist").click( function() {
		$("#albumArtistsTable").jqxGrid("addrow", null, {
			ArtistID: null,
			Artist: "",
			ShiftArtistUp: "Shift Up",
			ShiftArtistDown: "Shift Down",
			DeleteArtist: "Delete"
		});
		newArtistCounter++;
		$("#albumArtistsTable").change();
	});
	$("#albumGenresTable").jqxGrid({
		editable: true,
		source: albumGenresSource,
		columns: [{
			text: "Genre",
			datafield: "Genre",
			columntype: "combobox",
			initeditor: function (index, value, editor) {
				$(editor).jqxComboBox({source: genres});
				removeParentsAndChildren(editor, value);
				for (var i = 0; i < $("#albumGenresTable").jqxGrid("getrows").length; i++) {
					if (i != index) {
						$(editor).jqxComboBox("removeItem", $("#albumGenresTable").jqxGrid("getcellvalue", i, "Genre"));
						removeParentsAndChildren(editor, $("#albumGenresTable").jqxGrid("getcellvalue", i, "Genre"));
					}
				}
				$(editor).jqxComboBox("val", value);
			}
		},{
			text: "Shift Down",
			datafield: "ShiftGenreDown",
			columntype: "button",
			buttonclick: function(row) {
				if (row != albumGenres.length - 1) {
					var genreToShift = $("#albumGenresTable").jqxGrid("getcellvalue", row, "Genre");
					$("#albumGenresTable").jqxGrid("setcellvalue", row, "Genre", $("#albumGenresTable").jqxGrid("getcellvalue", row + 1, "Genre"));
					$("#albumGenresTable").jqxGrid("setcellvalue", row + 1, "Genre", genreToShift);
					$("#albumGenresTable").change();
				}
			}
		},{
			text: "Shift Up",
			datafield: "ShiftGenreUp",
			columntype: "button",
			buttonclick: function(row) {
				if (row != 0) {
					var genreToShift = $("#albumGenresTable").jqxGrid("getcellvalue", row, "Genre");
					$("#albumGenresTable").jqxGrid("setcellvalue", row, "Genre", $("#albumGenresTable").jqxGrid("getcellvalue", row - 1, "Genre"));
					$("#albumGenresTable").jqxGrid("setcellvalue", row - 1, "Genre", genreToShift);
					$("#albumGenresTable").change();
				}
			}
		},{
			text: "Delete",
			datafield: "DeleteGenre",
			columntype: "button",
			buttonclick: function(row) {
				$("#albumGenresTable").jqxGrid("deleterow", row);
				$("#albumGenresTable").change();
			}
		}]
	});
	$("#addAlbumGenre").click( function() {
		$("#albumGenresTable").jqxGrid("addrow", null, {
			Genre: "",
			ShiftGenreDown: "Shift Down",
			ShiftGenreUp: "Shift Up",
			DeleteGenre: "Delete"
		});
		$("#albumGenresTable").change();
	});
	$("#discInput").jqxNumberInput({
		min: 1,
		max: 10,
		decimal: 1,
		inputMode: "simple",
		spinButtons: true,
		decimalDigits: 0
	});
	
	$("#addTracksField").jqxTextArea({
		placeHolder: "Enter track data, separated by tabs",
		height: "100px"
		});
	$("#addTracksField").change( function (event) {
		$("#addTracksButton, #cancelAddTracks").jqxButton({
			disabled: $("#addTracksField").jqxTextArea("val") == ""
		});
	});
	$("#addTracksButton, #cancelAddTracks").jqxButton({disabled: true});
	$("#cancelAddTracks").click( function (evt) {
		$("#addTracksField").jqxTextArea("val","");
		$("#addTracksButton, #cancelAddTracks").jqxButton({disabled: true});
	});
	$("#tracksTable").jqxGrid({
		source: tracksSource,
		editable: true,
		columns: [{
			text: "Track",
			datafield: "Track",
			columntype: "numberinput",
			editable: false
		},{
			text: "Length",
			datafield: "Length",
			columntype: "textbox",
			editable: false
		},{
			text: "Size",
			datafield: "Size",
			columntype: "textbox",
			editable: false
		},{
			text: "Title",
			datafield: "Title",
			columntype: "textbox"
		},{
			text: "Shift Titles Down",
			datafield: "ShiftTitlesDown",
			columntype: "button",
			buttonclick: function (row) {
				if (row < $("#tracksTable").jqxGrid("getrows").length - 1) {
					$("#tracksTable").jqxGrid("endrowedit", row, true);
					$("#tracksTable").jqxGrid("endrowedit", row + 1, true);
					var title = $("#tracksTable").jqxGrid("getcellvalue", row, "Title");
					$("#tracksTable").jqxGrid("setcellvalue", row, "Title", $("#tracksTable").jqxGrid("getcellvalue", row + 1, "Title"));
					$("#tracksTable").jqxGrid("setcellvalue", row + 1, "Title", title);
				}
			}
		},{
			text: "Shift Titles Up",
			datafield: "ShiftTitlesUp",
			columntype: "button",
			buttonclick: function (row) {
				if (row > 0) {
					$("#tracksTable").jqxGrid("endrowedit", row, true);
					$("#tracksTable").jqxGrid("endrowedit", row - 1, true);
					var title = $("#tracksTable").jqxGrid("getcellvalue", row, "Title");
					$("#tracksTable").jqxGrid("setcellvalue", row, "Title", $("#tracksTable").jqxGrid("getcellvalue", row - 1, "Title"));
					$("#tracksTable").jqxGrid("setcellvalue", row - 1, "Title", title);
				}
			}
		}]
	});
	$("#tracksTable").on("cellbeginedit", function (evt) {
		trackEditing = evt.args.rowindex;
	});
	$("#trackArtistsTable").jqxGrid({
		source: trackArtistsSource,
		editable: true,
		columns: [{
			text: "Track",
			datafield: "Track",
			displayfield: "Title",
			columntype: "combobox",
			initeditor: function(row, value, editor) {
				trackArtistTrackSource = [];
				for (var i = 0; i < discs[$("#discInput").jqxNumberInput("val")].tracks.length; i++) {
					trackArtistTrackSource.push({
						Track: discs[$("#discInput").jqxNumberInput("val")].tracks[i].Track,
						Title: discs[$("#dicsInput").jqxNumberInput("val")].tracks[i].Title
					});
					if (trackArtistsTrackSource[i].Title == null || trackArtistsTrackSource[i].Title == "") {
						trackArtistsTrackSource[i].title = "Track " || trackArtistsTrackSource[i].track;
					}
				}
				$(editor).jqxComboBox({
					source: trackArtistTrackSource,
					displayMember: "Title",
					valueMember: "Track"
				});
				$(editor).jqxComboBox("val", value);
			}
		},{
			text: "Sequence",
			datafield: "SeqNo",
			columntype: "numberinput",
			initeditor: function(row, value, editor) {
				$(editor).jqxNumberInput({
					decimal: value,
					decimalDigits: 0,
					min: 1,
				});
			},
			cellendedit: function(row, datafield, columntype, oldvalue, value) {
				for (var i = 0; i < $("#trackArtistsTable").jqxGrid("getrows").length ; i++) {
					if (i != row && $("#trackArtistsTable").jqxGrid("getcellvalue", i, "Track") == $("#trackArtistsTable").jqxGrid("getcellvalue", row, "Track") && $("#trackArtistsTable").jqxGrid("getcellvalue", i, "SeqNo") == value) {
						$("#trackArtistsTable").jqxGrid("setcellvalue", i, "SeqNo", oldvalue);
					}
				}
			}
		},{
			text: "Artist",
			datafield: "Artist",
			columntype: "textbox"
		},{
			text: "Delete",
			datafield: "DeleteTrackArtist",
			columntype: "button",
			buttonclick: function (row) {
				$("#trackArtistsTable").jqxGrid("deleterow", row);
			}
		}]
	});
	$("#addTrackArtist").jqxButton({
		disabled: true
		});
	$("#addTrackArtist").click( function (evt) {
		$("#trackArtistsTable").jqxGrid("addrow",null,{
			Track: -1,
			SeqNo: 1,
			Artist: "",
			DeleteTrackArtist: "Delete"
		});
	});
	$("#discInput").change( function (evt) {
		$("#tracksTable").jqxGrid("endrowedit", tracksEditing, true);
		$("#trackArtistsTable").jqxGrid("endrowedit", tracksEditing, true);
		while (discs.length > 0 && discs[discs.length - 1].tracks.length == 0 && discs[discs.length - 1].trackArtists.length == 0) {
			discs.pop();
		}
		while (discs.length < $("#discInput").jqxNumberInput("val")) {
			discs.push({
				tracks: [],
				trackArtists: []
			});
		}
		ArchiveMusic.each("SELECT Tracks.Track, Tracks.Length, Tracks.Size, coalesce(Title, '') AS Title, 'Shift Title Up' AS ShiftTitlesUp, 'Shift Title Down' AS ShiftTitlesDown FROM Tracks WHERE Tracks.RecYear = ? AND Tracks.Album = ? AND Tracks.Disc = ?",
		[$("#yearInput").jqxNumberInput("val"), $("#albumInput").jqxNumberInput("val"), $("#discInput").jqxNumberInput("val")],
		function (row) {
			discs[$("#discInput").jqxNumberInput("val") - 1].tracks.push(row);
		});
		ArchiveMusic.each("SELECT Tracks.Track, coalesce(Title, '') AS Title, TrackArtists.SeqNo, TrackArtists.Artist FROM Tracks INNER JOIN TrackArtists ON Tracks.RecYear = TrackArtists.RecYear AND Tracks.Track = TrackArtists.Track AND Tracks.Album = TrackArtists.Album AND Tracks.Disc = TrackArtists.Disc WHERE Tracks.RecYear = ? AND Tracks.Album = ? AND Tracks.Disc = ?",
		[$("#yearInput").jqxNumberInput("val"), $("#albumInput").jqxNumberInput("val"), $("#discInput").jqxNumberInput("val")],
		function (row) {
			discs[$("#discInput").jqxNumberInput("val") - 1].trackArtists.push(row);
		});
		tracksSource.localdata = discs[$("#discInput").jqxNumberInput("val") - 1].tracks;
		trackArtistsSource.localdata = discs[$("#discInput").jqxNumberInput("val") - 1].tracks;
		$("#tracksTable").jqxGrid("updatebounddata");
		$("#trackArtistsTable").jqxGrid("updatebounddata");
	});
	$("#trackArtistsTable").on("cellbeginedit", function(evt) {
		trackArtistEditing = evt.args.rowindex;
	});
	populateAlbum();
		
	$("#albumContent").on("change", onAlbumChange);
}

function populateAlbum() {
	//$("#albumContent").off("change");
	var paramArray = [$("#yearInput").jqxNumberInput("val"),$("#albumInput").jqxNumberInput("val")];
	var albumStmt = ArchiveMusic.prepare("SELECT coalesce(RecDate, RecYear || '-04-01') AS RecDate, coalesce(OtherLocation, '') AS OtherLocation, coalesce(Location, '') AS Location FROM Albums WHERE Albums.RecYear = ? AND Albums.Album = ?",
	paramArray);
	var recDate = new Date();
	if (albumStmt.step()) {
		var albumObject = albumStmt.getAsObject();
		recDate = new Date(albumObject.RecDate);
		$("#albumLocationInput").jqxComboBox("val", albumObject.Location);
		$("#otherLocation").val(albumObject.OtherLocation);
		$("#otherLocation").jqxInput({
			disabled: albumObject.Location != ""
		});
		artists = [];
		ArchiveMusic.each("SELECT Artists.SeqNo, Artists.Artist, 'Shift Down' AS ShiftArtistDown, 'Shift Up' AS ShiftArtistUp, 'Delete' AS DeleteArtist FROM Artists WHERE Artists.RecYear = ? AND Artists.Album = ?", paramArray, function (row) {
			artists.push({
				Artist: row.Artist,
				ShiftArtistDown: row.ShiftArtistDown,
				ShiftArtistUp: row.ShiftArtistUp,
				DeleteArtist: row.DeleteArtist
				});
		});
		
		albumGenres = [];
		ArchiveMusic.each("SELECT AlbumGenre.SeqNo, AlbumGenre.Genre, 'Shift Down' AS ShiftGenreDown, 'Shift Up' AS ShiftGenreUp, 'Delete' AS DeleteGenre FROM AlbumGenre WHERE AlbumGenre.RecYear = ? AND AlbumGenre.Album = ?",
		paramArray,
		function(row) {
			albumGenres.push(row);
		});
		
		discs = [];
		ArchiveMusic.each("SELECT coalesce(max(Disc), 1) AS MaxDisc FROM Tracks WHERE Tracks.RecYear = ? AND Tracks.Album = ?", paramArray, function(maxDisc) {
			paramArray.push(1);
			for (var i = 0; i < maxDisc.MaxDisc; i++) {
				discs.push({
					tracks: [],
					trackArtists: []
				});
				paramArray[2] = i + 1;
				ArchiveMusic.each("SELECT Tracks.Track, Tracks.Length, Tracks.Size, coalesce(Title, '') AS Title, 'Shift Title Down' AS ShiftTitlesDown, 'Shift Title Up' AS ShiftTitlesUp FROM Tracks WHERE Tracks.RecYear = ? AND Tracks.Album = ? AND Tracks.Disc = ?",
				paramArray,
				function (row) {
					discs[i].tracks.push(row);
				});
				ArchiveMusic.each("SELECT Tracks.Track, coalesce(Title, '') AS Title, TrackArtists.SeqNo, TrackArtists.Artist FROM Tracks INNER JOIN TrackArtists ON Tracks.RecYear = TrackArtists.RecYear AND Tracks.Track = TrackArtists.Track AND Tracks.Album = TrackArtists.Album AND Tracks.Disc = TrackArtists.Disc WHERE Tracks.RecYear = ? AND Tracks.Album = ? AND Tracks.Disc = ?",
				[$("#yearInput").jqxNumberInput("val"), $("#albumInput").jqxNumberInput("val"), $("#discInput").jqxNumberInput("val")],
				function (row) {
					discs[i].trackArtists.push(row);
				});
			}
		});
	} else {
		ArchiveMusic.each("SELECT coalesce(max(RecDate), :RecYear || '-04-01') AS MaxDate FROM Dates WHERE CAST (strftime('%Y',RecDate) AS INTEGER) = :RecYear AND MinAlbum <= :Album", paramArray, function (row) {
			recDate = new Date(row.MaxDate);
		});
		$("#albumLocationInput").jqxComboBox("val","");
		$("#otherLocation").val("");
		$("#otherLocation").jqxInput({
			disabled: false
		});
		artists = [];
		albumGenres = [];
		discs = [{
			tracks: [],
			trackArtists: []
		}]
	}
	albumStmt.free();
	recDate.setHours(24,0,0,0);
	$("#albumDateInput").jqxDateTimeInput("val", recDate);
	artistsSource.localdata = artists;
	$("#albumArtistsTable").jqxGrid({source: artistsSource});
	$("#albumArtistsTable").jqxGrid("updatebounddata");
	albumGenresSource.localdata = albumGenres;
	$("#albumGenresTable").jqxGrid("updatebounddata");
	$("#discInput").jqxNumberInput("setDecimal",1);
	tracksSource.localdata = discs[0].tracks;
	trackArtistsSource.localdata = discs[0].trackArtists;
	$("#tracksTable").jqxGrid("updatebounddata");
	$("#trackArtistsTable").jqxGrid("updatebounddata");
	$("#addTrackArtist").jqxButton({
		disabled: discs[0].tracks.length == 0
	});
	$("#commitAlbum, #rollbackAlbum").jqxButton({disabled: true});
	$("#albumInput").jqxNumberInput({disabled: false});
	$("#yearInput").jqxNumberInput({disabled: datesEditing});
	//$("#albumContent").change(onAlbumChange);
}
