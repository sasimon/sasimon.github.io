SELECT
	max(Albums.Album) AS MaxAlbum
FROM
	Albums
WHERE
	Albums.RecYear IN (SELECT
							max(Albums1.RecYear)
						 FROM
							Albums Albums1)