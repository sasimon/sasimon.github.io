function rollbackReparentedGenre() {
	reparenting = false;
	$("#reparentParentsPool").jqxListBox("clearSelection");
	ArchiveMusic.each("SELECT Parent FROM GenreParent WHERE Genre = ?",
		[$("#genreToReparent").jqxListBox("getSelectedItem").value],
		function (row) {
			$("#reparentParentsPool").jqxListBox("selectItem", row.Parent);
		}
	);
	$("#reparentParentsPool").jqxListBox({disabled: true});
	$("[id^=reparent]").filter(":button").jqxButton({
		disabled: true
	});
	$("#closeGenres").jqxButton({
		disabled: newGenre
	});
}
function rollbackNewGenre() {
	newGenre = false;
	$("#newGenre").val("");
	$("#newGenreParentsPool").jqxListBox("clearSelection");
	$("[id^=newGenre]").filter(":button").jqxButton({
		disabled: true
	});
	$("#closeGenres").jqxButton({
		disabled: reparenting
	});
	$("#newGenreParentsPool").jqxListBox({disabled: true});
}
function appendGenres() {
	// Genres group
	$("#genres").jqxExpander({
		expanded: false
		});
	$("#reparentGenres, #newGenre").jqxExpander({
		toggleMode: "none",
		showArrow: "false"
	});
	genres = [];
	ArchiveMusic.each("SELECT * FROM Genres", [], function (row) {
		genres.push(row.GenreName);
	});
	genres = genres.sort();
	$("#genreToReparent, #reparentParentsPool, #newGenreParentsPool").jqxListBox({
		filterable: true,
		height: "250px",
		width: "400px",
		source: genres
	});
	$("#reparentParentsPool, #newGenreParentsPool").jqxListBox({
		multiple: true,
		multipleExtended: true,
		disabled: true
	});
	$("#newGenreName").jqxInput({
		width: "400px"
	});
	$('input[type=button][id^="reparentGenres"],input[type=button][id^="newGenre"]').jqxButton({
		disabled: true
	});
	$("#closeGenres").jqxButton();
	// Event handlers
	// List boxes
	$("#genreToReparent").on("select", function(evt) {
		reparenting = true;
		$("#closeGenres").jqxButton({
			disabled: true
		});
		$("input[type=button][id^=reparent]").jqxButton({
			disabled: false
		});
		$("#reparentParentsPool").jqxListBox({disabled: false});
		$("#reparentParentsPool").jqxListBox("clearSelection");
		for (var i = 0; i < genres.length; i++) {
			if ($("#reparentParentsPool").jqxListBox("getItem",i).value == evt.args.item.value) {
				//$("#reparentParentsPool").jqxListBox("unselectIndex",i);
				$("#reparentParentsPool").jqxListBox("disableAt",i);
			}
			else {
				$("#reparentParentsPool").jqxListBox("enableAt",i);
			}
		}
		ArchiveMusic.each("SELECT Parent FROM GenreParent WHERE Genre = ?",[evt.args.item.value], function(row) {
			$("#reparentParentsPool").jqxListBox("selectItem",$("#reparentParentsPool").jqxListBox("getItemByValue", row.Parent));
		});
	});
	// Input box
	$("#newGenreName").change(function() {
		if ($("#newGenreName").val() == "") {
			rollbackNewGenre()
		} else {
			newGenre = true;
			$("#newGenreParentsPool").jqxListBox({disabled: false});
			$("#newGenreRollback").jqxButton({
				disabled: false
			});
			$("#newGenreCommit").jqxButton({
				disabled: genres.indexOf($("#newGenreName").val()) != -1
			});
			$("#closeGenres").jqxButton({
				disabled: true
			});
		}
			
	});
	// Buttons
	$("#reparentGenresRollback").click(rollbackReparentedGenre);
	$("#reparentGenresCommit").click(function() {
		ArchiveMusic.run("DELETE FROM GenreParent WHERE Genre = ?",[$("#genreToReparent").jqxListBox("getSelectedItem").value]);
		for (var i = 0; i < $("#reparentParentsPool").jqxListBox("getSelectedItems").length; i++) {
			ArchiveMusic.run("INSERT INTO GenreParent VALUES (?,?)",[$("#genreToReparent").jqxListBox("getSelectedItem").value, $("#reparentParentsPool").jqxListBox("getSelectedItems")[i].value]);
		}
		rollbackReparentedGenre();
	});
	$("#newGenreRollback").click(rollbackNewGenre);
	$("#newGenreCommit").click(function() {
		ArchiveMusic.run("INSERT INTO Genres VALUES (?)", [$("#newGenreName").val()]);
		for (var i = 0; i < $("#newGenreParentsPool").jqxListBox("getSelectedItems").length; i++) {
			ArchiveMusic.run("INSERT INTO GenreParent VALUES (?, ?)", [$("#newGenreName").val(), $("#newGenreParentsPool").jqxListBox("getSelectedItems")[i]]);
		}
		genres.push($("#newGenreName").val());
		genres = genres.sort();
		var reparentingGenre = $("#genreToReparent").jqxListBox("getSelectedItem");
		var reparentingParents = $("#reparentParentsPool").jqxListBox("getSelectedItems");
		$("#genreToReparent, #reparentParentsPool, #newGenreParentsPool").jqxListBox({
			source: genres
		});
		if (reparenting) {
			$("#genreToReparent").jqxListBox("selectItem", reparentingGenre.value);
			for (var i = 0; i < reparentingParents.length; i++) {
				$("#reparentParentsPool").jqxListBox("selectItem", reparentingParents[i].value);
			}
		}
		rollbackNewGenre();
	});
	
	
		
}
