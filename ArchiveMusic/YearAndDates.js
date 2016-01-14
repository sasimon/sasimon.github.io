function rollbackDates() {
	dates = [];
	ArchiveMusic.each("SELECT RecDate, MinAlbum FROM DatesView WHERE RecYear = ?",
	[year],
	function (row) {
		dates.push({
			RecDate: new Date(row.RecDate),
			MinAlbum: row.MinAlbum
			});
	});
	datesSource.localdata = dates;
	$("#datesTable").jqxGrid({source: datesSource});
		$("#commitDates, #rollbackDates").jqxButton({
			disabled: true
		});
		$("#closeDates").jqxButton({
			disabled: false
		});
}
function setupYear() {
	year = Number.parseInt($("#yearInput").jqxNumberInput("getDecimal"));
dates = [];
	ArchiveMusic.each("SELECT RecDate, MinAlbum FROM DatesView WHERE RecYear = ?",
	[year],
	function (row) {
		dates.push({
			RecDateId: row.RecDate,
			RecDate: new Date(row.RecDate),
			MinAlbum: row.MinAlbum
			});
	});
	datesSource.localdata = dates;
	$("#datesTable").jqxGrid({
		editable: true,
		columns: [{
			text: "Date",
			datafield: "RecDate",
			columntype: "datetimeinput",
			cellsformat: "M/d",
			initeditor: function (row, value, editor) {
				$(editor).jqxDateTimeInput({
					min: new Date(year, 3, 1),
					max: new Date(year, 4, 31),
				});
			}
			},{
				text: "Minimum Album",
				datafield: "MinAlbum",
				columntype: "numberinput",
				initeditor: function (row, value, editor) {
					$(editor).jqxNumberInput({
						digits: 3,
						decimalDigits: 0,
						min: 0,
						max: 999
					});
				}
			}],
			source: datesSource,
			width: "360px",
			height: "250px"
		});
		$("#commitDates, #rollbackDates").jqxButton({
			disabled: true
		});
		$("#closeDates").jqxButton({
			disabled: false
		});
	$("#datesTable").jqxGrid("updatebounddata");
	$("#datesTable").on("cellbeginedit", function(evt) {
		datesEditing = evt.args.rowindex;
		$("#commitDates, #rollbackDates").jqxButton({
			disabled: false
		});
		$("#closeDates").jqxButton({
			disabled: true
		});
	});
	$("#rollbackDates").click(rollbackDates);
	$("#commitDates").click(function () {
		ArchiveMusic.each("SELECT COUNT(*) AS DeleteCount FROM DatesView WHERE RecYear = ?", [year], function(row) {
			;
		});
		ArchiveMusic.run("DELETE FROM DatesView WHERE RecYear = ?", [year]);
		for (var i = 0; i < dates.length; i++) {
			ArchiveMusic.run("INSERT INTO DatesView VALUES (?, ?, null)", [dates[i].RecDate.toISOString(), dates[i].MinAlbum]);
		}
		rollbackDates();
	});
	$("#addDate").jqxButton();
	$("#addDate").click( function () {
		var newDate;
		if (dates.length == 0) {
			newDate = {
				RecDateId: year + "-04-01",
				RecDate: new Date(year, 3, 1),
				MinAlbum: 1
			};
		} else {
			var oldDate = dates[dates.length - 1].RecDate;
			var newDate1 = new Date(oldDate.getFullYear(), oldDate.getMonth(), oldDate.getDate() + 1);
			newDate = {
				RecDateId: newDate1.toISOString(),
				RecDate: newDate1,
				MinAlbum: dates[dates.length - 1].MinAlbum + 1
			};
		}
		$("#datesTable").jqxGrid("addrow", null, newDate);
		$("#commitDates, #rollbackDates").jqxButton({
			disabled: false
		});
		$("#closeDates").jqxButton({
			disabled: true
		});
	});
	$("#closeDates").jqxButton();
	$("#closeDates").click(function() {
		$("#dates").jqxExpander("collapse");
		$("#album").jqxExpander("expand");
	});
	$("#albumInput").jqxNumberInput("val", 1);
	populateAlbum();
}
			
function yearAndDates() {
	$("#year").jqxExpander({
		toggleMode: "none",
		showArrow: false
	});
	$("#dates").jqxExpander({
		toggleMode: "none",
		showArrow: false,
		expanded: false
	});
	ArchiveMusic.each("SELECT COALESCE(MAX(RecYear), 2004) AS MaxYear FROM Albums",[], function (max) {
		$("#yearInput").jqxNumberInput({
			min: 2004,
			max: (new Date()).getFullYear(),
			decimal: max.MaxYear,
			digits: 4,
			decimalDigits: 0,
			groupSeparator: '',
			spinButtons: true
		});
	});
	setupAlbums();
	$("#yearInput").change(setupYear);
	setupYear();
	$("#datesTable").change( function() {
		$("#yearInput").jqxNumberInput({
			disabled: true
		});
	});
	ArchiveMusic.each("SELECT max(Albums.Album) AS MaxAlbum FROM Albums WHERE Albums.RecYear IN (SELECT max(Albums1.RecYear) FROM Albums Albums1)",[], function (row) {
		$("#albumInput").jqxNumberInput("val", row.MaxAlbum);
	});
	$("#albumInput").change(populateAlbum);
	populateAlbum();
}
