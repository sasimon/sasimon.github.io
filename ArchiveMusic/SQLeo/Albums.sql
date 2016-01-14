SELECT
	STRFTIME('%Y',Albums.RecDate) AS RecYear,
	SUBSTR(Albums.Album,10) AS Album,
	Albums.RecDate,
	Albums.OtherLocation,
	Albums.Location
FROM
	Albums