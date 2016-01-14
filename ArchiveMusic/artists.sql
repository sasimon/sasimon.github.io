SELECT
	Artists.SeqNo,
	Artists.Artist
FROM
	Artists
WHERE
	Artists.RecYear = ?
	AND Artists.Album = ?