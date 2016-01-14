SELECT
	SUBSTR(Disc, 5, 4) AS RecYear,
	SUBSTR(Disc, 10, 3) AS Album,
	CASE WHEN INSTR(Disc, '-') = 0 THEN 1 ELSE SUBSTR(Disc, 14) END AS Disc,
	REPLACE(REPLACE(Track, 'Track', ''), '.wav', '') AS Track,
	Tracks.Length,
	Tracks.Size,
	Tracks.Title
FROM
	Tracks