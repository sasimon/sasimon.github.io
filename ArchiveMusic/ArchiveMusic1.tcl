
package require sqlite3
sqlite3 ArchiveMusic "ArchiveMusic.sqlite"
set year 2012
catch {
	if {[ArchiveMusic exists "SELECT * from Albums where strftime('\%Y',RecDate) = '$year'"]} then {
ArchiveMusic eval "SELECT Disc from Discs join Albums using (Album) where strftime('\%Y',RecDate) = '$year'" {
set l1 [list {"dcterms.IsPartof"} {"dc.Identifier"} {"dc.Title"}]
ArchiveMusic eval "SELECT * from Artists join Discs using (Album) where Disc = '$Disc'" {lappend l1 {"dc.Creator"}}
set TrackArtistCount [ArchiveMusic onecolumn "select coalesce(max(TrackArtistCount),0) from (select count(*) as TrackArtistCount from TrackArtist where Disc = '$Disc' group by Track)"]
	puts $TrackArtistCount
set i 0
while {$i < $TrackArtistCount} {
	lappend l1 {"dc.Creator"}
	incr i
}
lappend l1 {"dc.Contributor"} {"dc.Format"} {"dcterms.Coverage"} {"dcterms.Extent"} {"dc.Date"}
ArchiveMusic eval "SELECT * from AlbumGenre join Discs using (Album) where Disc = '$Disc'" {lappend l1 {"dc.Subject"}}
lappend l1 {"dcterms.Coverage"} {"dc.Publisher"} {"dc.Rights"}
set l2 {}
lappend l2 [join $l1 ","]
ArchiveMusic eval "SELECT Track, Title, Length, Size, RecDate, coalesce('New Orleans Jazz & Heritage Festival ' || (select LocationName from Locations where LocID = Location and strftime('\%Y',RecDate) between StartYear and coalesce(EndYear,strftime('\%Y','now'))),OtherLocation,'') as Location, strftime('\%Y',RecDate) || ' - All rights reserved by the original recording artist.' as Copyright from Tracks join Discs using (Disc) join Albums using (Album) where Discs.Disc = '$Disc'" l3array {
set l3 [list {"Licensed Media"} "\"$Disc\_[string range $l3array(Track) 5 6]\"" "\"$l3array(Title)\""]
ArchiveMusic eval "SELECT Artist from Artists join Discs using (Album) where Disc = '$Disc'" {
lappend l3 "\"$Artist\""}
	set k 0
	while {$k < $TrackArtistCount} {
		incr k
		ArchiveMusic eval "select coalesce((select '\"' || Artist || '\"' from TrackArtist where TrackArtist.Disc = Tracks.Disc and TrackArtist.Track = Tracks.Track and SeqNo = $k),'') as TrackArtist1 from Tracks where Disc = '$Disc' and Track = '$l3array(Track)';" "" {
			lappend l3 $TrackArtist1
		}
		
	}
lappend l3 {"Peer Munck"} {"Audio/wav"} "\"$l3array(Length)\"" "\"$l3array(Size)\"" "$l3array(RecDate)"
ArchiveMusic eval "SELECT Genre from AlbumGenre join Discs using (Album) where Disc = '$Disc'" {
lappend l3 "\"$Genre\""}
lappend l3 "\"$l3array(Location)\"" {"New Orleans Jazz & Heritage Foundation Archive"} "\"$l3array(Copyright)\""
lappend l2 [join $l3 ","]
}
foreach line $l2 {puts $line}
if {[file exists "E:\\Munck Mix $year\\$Disc"] == 0} {file mkdir "E:\\Munck Mix $year\\$Disc"}
cd "E:\\Munck Mix $year\\$Disc\\"
set file1 [open "metadata.csv" w+]
foreach line $l2 {puts $file1 $line}
close $file1
}

	} else {
puts "There are no albums in year $year."
}
}
puts $errorInfo


ArchiveMusic close


