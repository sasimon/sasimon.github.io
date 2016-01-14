function createYearEditor(row, value, editor, text, width, height) {
	editor.append('<input type="text"/><div></div>');
	editor.jqxFormattedInput({
		min: 2004,
		max: (new Date()).getFullYear(),
		spinButtons: true,
		width: width,
		height: height
	});
}
function rollbackLocationNames() {
	$("#addLocationName").jqxButton();
	$("#commitLocationName, #rollbackLocationName").jqxButton({
		disabled: true
	});
	$("#addLocationName").click(function() {
		var newLocationName = {
			LocationNameID: "NEW" + locationsNewRecordCount++,
			LocID: "",
			LocationName: "",
			StartYear: 2004,
			EndYear: (new Date()).getFullYear() + 1
		};
		$("#locationNamesTable").jqxGrid("addrow",newLocationName.ID,newLocationName);
		$("#locationNamesTable").jqxGrid("beginrowedit",$("#locationNamesTable").jqxGrid("getrows").length - 1);
	});
	$("#commitLocationName").click(function () {
		var currentRows = $("#locationNamesTable").jqxGrid("getrows");
		for (var i = 0; i < currentRows.length; i++) {
			var j = 0;
			while (j < locations.length && locations[j].LocationNameID != currentRows[i].LocationNameID) {
				j++;
			}
			if (j == locations.length) {
				ArchiveMusic.run("INSERT INTO LocationsView VALUES (?,?,?,?,?)",
				[currentRows[i].LocationNameID, currentRows[i].LocID, currentRows[i].LocationName, currentRows[i].StartYear, currentRows[i].EndYear]);
			} else if (currentRows[i].LocID != locations[j].LocID || currentRows[i].StartYear != currentRows[i].StartYear) {
				ArchiveMusic.run("DELETE FROM LocationsView WHERE LocationNameID = ?",[locations[j].LocationNameID]);
				ArchiveMusic.run("INSERT INTO LocationsView VALUES (?,?,?,?,?)",
				[currentRows[i].LocationNameID,currentRows[i].LocID, currentRows[i].LocationName, currentRows[i].StartYear, currentRows[i].EndYear]);
			} else if (currentRows[i].LocationName != locations[j].LocationName || currentRows[i].EndYear != locations[j].EndYear) {
				ArchiveMusic.run("UPDATE LocationsView SET LocationName = ?, EndYear = ? WHERE LocationNameID = ?", [currentRows[i].LocationName, currentRows[i].EndYear, currentRows[i].LocationNameID]);
			}
		}
		for (var j=0; j < locations.length; j++) {
			var i = 0;
			while (i < currentRows.length && locations[j].LocationNameID != currentRows[i].LocationNameID) {
				i++;
			}
			if (i == currentRows.length) {
				ArchiveMusic.run("DELETE FROM LocationView WHERE LocationNameID = ?",[locations[j].LocationNameID]);
			}
		}
		rollbackLocationNames();
			
	});
	$("#rollbackLocationName").click(rollbackLocationNames);
	locations = [];
	ArchiveMusic.each("SELECT * FROM LocationsView",[],function (row) {
		locations.push({
			LocationNameID: row.LocationNameID,
			LocID: row.LocID,
			LocationName: row.LocationName,
			StartYear: row.StartYear,
			EndYear: row.EndYear
			});
	});
	locationsSource = {
		datatype: "array",
		localdata: locations,
		id: "LocationNameID"
	};
	$("#locationNamesTable").jqxGrid({
		source: locationsSource,
		editable: true,
		columns: [{
			text: "Location ID",
			datafield: "LocID",
			columntype: "combobox",
			initeditor: function(index, value, editor) {
				locIDs = locIDs.sort();
				$(editor).jqxComboBox({
					source: locIDs
				});
				$(editor).jqxComboBox("val",value);
			}
		},{
			text: "Location Name",
			datafield: "LocationName",
			columntype: "textbox"
		},{
			text: "Start Year",
			datafield: "StartYear",
			columntype: "numberinput",
			initeditor: function(index, value, editor) {
				$(editor).jqxNumberInput({
					min: 2004,
					max: (new Date()).getFullYear()
				});
			},
			cellendedit: function(row, column, type, oldvalue, newvalue) {
				if ($("#locationNamesTable").jqxGrid("getcellvalue", row, "EndYear") < newvalue) {
					$("#locationNamesTable").jqxGrid("setcellvalue", row, "EndYear", newvalue);
				}
			}
		},{
			text: "End Year",
			datafield: "EndYear",
			columntype: "numberinput",
			initeditor: function(index, value, editor) {
				$(editor).jqxNumberInput({
					min: 2004,
					max: (new Date()).getFullYear() + 1
				});
			},
			cellendedit: function(row, column, type, oldvalue, newvalue) {
				if ($("#locationNamesTable").jqxGrid("getcellvalue", row, "StartYear") > newvalue) {
					$("#locationNamesTable").jqxGrid("setcellvalue", row, "StartYear", newvalue);
				}
			}
		}]
	});
}

function appendLocations() {
	// Locations group
	$("#locationNames, #addLocID").jqxExpander({
		toggleMode: "none"
	});
	$("#locIdToAdd").jqxInput({
		minLength: 3,
		maxLength: 3
	});
	$("#locIdToAdd").change(function () {
		locIdToAdd = $("#locIdToAdd").val().toUpperCase();
		$("#saveLocID").jqxButton({
			disabled: !(locIdToAdd.length == 3 && locIDs.indexOf(locIdToAdd) == -1)
		});
	});
	$("#saveLocID").jqxButton({
		disabled: true
	});
	$("#saveLocID").click(function() {
		ArchiveMusic.run("INSERT INTO LocIDs VALUES (?)",[locIdToAdd]);
		locIDs.push(locIdToAdd);
		$("#locIdToAdd").val("");
		$("#saveLocID").jqxButton({
			disabled: true
		});
	});
	$("#locationNames").jqxExpander("setContent",'<input type="button" id="addLocationName" value="Add Location Name" />\
	<input type="button" id="commitLocationName" value="Commit" />\
	<input type="button" id="rollbackLocationName" value="Rollback" />\
	<div id="locationNamesTable"></div>');
	rollbackLocationNames();
	$("#locationNamesTable").on("cellbeginedit", function(evt) {
		locationsEditIndex = evt.args.index;
		$("#commitLocationName, #rollbackLocationName").jqxButton({
			disabled: false
		});
	});
}
