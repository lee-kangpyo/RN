
const MAIN0205 = `
    exec PR_PLYA00_MAIN02 'MAIN0205', 0, @userId, @ymd, '', ''
`
const getCstListColor = `
    WITH _PLY AS (
        SELECT a.CSTCO , a.CSTNA, ROW_NUMBER() OVER (ORDER BY a.CSTCO) AS RowNum
        FROM PLYMCST a
        INNER JOIN PLYMCSTUSER b ON a.CSTCO  = b.CSTCO
        WHERE b.USERID = @userId
        AND b.RTCL  = 'N'
    )
    SELECT 
        CSTCO , CSTNA,
        CASE (RowNum - 1) % 5
            WHEN 0 THEN '#C80000'
            WHEN 1 THEN '#34A853'
            WHEN 2 THEN '#3396FE'
            WHEN 3 THEN '#1547FF'
            WHEN 4 THEN '#9933FF'
        END AS color
    FROM 
        _PLY;
`

module.exports = { MAIN0205, getCstListColor }
