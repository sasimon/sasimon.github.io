SELECT
	coalesce(max(RecDate), :RecYear || '-04-01') AS MaxDate
FROM
	Dates
WHERE
	CAST (strftime('%Y',RecDate) AS INTEGER) = :RecYear