var ArchiveMusic;
var albums = [];
var locIDs = [];
var locIdToAdd;
var locations = [];
var locationsSource = {
	datatype: "array",
	localdata: locations,
	id: "LocationNameID"
};
var locationsEditIndex;
var locationsNewRecordCount = 0;
var genres;
var genreParent;
var reparenting = false;
var newGenre = false;
var dates = [];
var datesSource = {
	datatype: "array",
	localdata: dates,
	id: "RecDateID",
	datafields: [{
		name: "RecDateID",
		type: "text"
	},{
		name: "RecDate",
		type: "date"
	},{
		name: "MinAlbum",
		type: "number"
	}],
	addrow: function (rowid, rowdata, position, commit) {
		dates.push(rowdata);
		commit(true);
	},
	updaterow: function (rowid, rowdata, commit) {
		for (var i = 0; i < dates.length; i++) {
			if (dates[i].RecDateID == rowid) {
				dates[i] = rowdata;
			}
		}
		commit(true);
	}
};
var datesEditing = false;
var year;
var albumEditing = false;
var locationsByYear = [{LocID: "Test", LocationName: "Test"}];
var locationsAdapter = new $.jqx.dataAdapter({
	datatype: "array",
	localdata: locationsByYear,
	id: "LocationID",
	datafields: [{
		name: "LocID", type: "string"
	},{
		name: "LocationName", type: "string"
	}]
},{
	beforeLoadComplete: function (records) {
		records.unshift({
			LocID: "",
			LocationName: "Please select a location or type one in: "
		});
		return records;
	}
});
var artists = [];
var artistsSource = {
	localdata: artists,
	datatype: "array",
	id: "ArtistID",
	datafields: [{
		name: "Artist",
		type: "string"
	},{
		name: "ShiftArtistUp",
		type: "string"
	},{
		name: "ShiftArtistDown",
		type: "string"
	},{
		name: "DeleteArtist",
		type: "string"
	}],
	addrow: function(rowid, rowdata, position, commit) {
		artists.push(rowdata);
		commit(true);
	},
	deleterow: function(rowid, commit) {
		artists.splice(rowid, 1);
		commit(true);
	},
	updaterow: function(rowid, newdata, commit) {
		artists[rowid].Artist = newdata.Artist;
		commit(true);
	}
}
var newArtistCounter = 0;
var albumGenres = [];
var albumGenresSource = {
	datatype: "array",
	localdata: albumGenres,
	id: "AlbumGenreID",
	datafields: [{
		name: "Genre",
		type: "string"
	},{
		name: "ShiftGenreDown",
		type: "string"
	},{
		name: "ShiftGenreUp",
		type: "string"
	},{
		name: "DeleteGenre",
		type: "string"
	}],
	addrow: function (rowid, rowdata, position, commit) {
		albumGenres.push(rowdata);
		commit (true);
	},
	deleterow: function (rowid, commit) {
		albumGenres.splice(rowid, 1);
		commit(true);
	},
	updaterow: function (rowid, rowdata, commit) {
		albumGenres.splice(rowid, 1, rowdata);
		commit(true);
	}
}
var disc;
var discs = [{
	tracks: [],
	trackArtists: []
}];
var tracksSource = {
	id: "TrackID",
	datatype: "array",
	localdata: discs[0].tracks,
	datafields: [{
		name: "Track",
		type: "number"
	},{
		name: "Length",
		type: "string"
	},{
		name: "Size",
		type: "string"
	},{
		name: "Title",
		type: "string"
	},{
		name: "ShiftTitlesDown",
		type: "string"
	},{
		name: "ShiftTitlesUp",
		type: "string"
	}],
	addrow: function(rowid, rowdata, position, commit) {
		discs[$("#discInput").jqxNumberInput("val")].tracks.push(rowdata);
		commit(true);
	},
	updaterow: function(rowid, rowdata, commit) {
		discs[$("#discInput").jqxNumberInput("val")].tracks.splice(rowid, 1, rowdata);
		commit(true);
	},
	deleterow: function(rowid, commit) {
		discs[$("#discInput").jqxNumberInput("val")].tracks.splice(rowid, 1);
		commit(true);
	}
}
var trackArtistsSource = {
	id: "TrackArtistID",
	datatype: "array",
	localdata: discs[0].trackArtists,
	datafields: [{
		name: "Track",
		type: "number"
	},{
		name: "Title",
		type: "string"
	},{
		name: "SeqNo",
		type: "number"
	},{
		name: "Artist",
		type: "string"
	},{
		name: "DeleteTrackArtist",
		type: "string"
	}],
	addrow: function(rowid, rowdata, position, commit) {
		discs[$("#discInput").jqxNumberInput("val")].trackArtists.push(rowdata);
		commit(true);
	},
	updaterow: function(rowid, rowdata, commit) {
		discs[$("#discInput").jqxNumberInput("val")].trackArtists.splice(rowid, 1, rowdata);
		commit(true);
	},
	deleterow: function(rowid, commit) {
		discs[$("#discInput").jqxNumberInput("val")].trackArtists.splice(rowid, 1);
		commit(true);
	}
}
var trackEditing = 0;
var trackArtistEditing = 0;

