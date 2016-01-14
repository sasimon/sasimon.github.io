SELECT
	coalesce(max(Disc), 1) AS MaxDisc
FROM
	Tracks
WHERE
	Tracks.RecYear = ?
	AND Tracks.Album = ?