SELECT
	AlbumGenre.SeqNo,
	AlbumGenre.Genre
FROM
	AlbumGenre
WHERE
	AlbumGenre.RecYear = ?
	AND AlbumGenre.Album = ?