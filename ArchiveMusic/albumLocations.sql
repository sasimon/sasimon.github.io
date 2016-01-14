SELECT
	Locations.LocID,
	coalesce(LocationName, '') AS LocationName
FROM
	Locations
WHERE
	? BETWEEN StartYear AND EndYear