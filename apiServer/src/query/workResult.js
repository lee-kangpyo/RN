


const albaWorkManager = `
    exec PR_PLYB01_WRKMNG  @cls, @cstCo, @userId, @ymdFR, @ymdTo, @jobCl, @jobDure
`
const monthCstSlySearch = `
    exec PR_PLYD02_SALARY @cls, @ymdFr, @ymdTo, @cstCo, @cstNa, @userId, @userNa, @rtCl
`
const getWage = `
        -- 마스터 급여 가져오기
    	WITH MinWageCTE AS (
            SELECT TOP 1 WAGE
            FROM MINWAGE
            WHERE VALIDFROM <= GETDATE()
            ORDER BY VALIDFROM DESC
        )
        SELECT a.USERID, ISNULL(b.JOBTYPE, 'H') JOBTYPE, ISNULL(b.BASICWAGE, m.WAGE) WAGE, isnull(b.MEALALLOWANCE, 0) MEALALLOWANCE
        FROM PLYMCSTUSER a 
            left JOIN PLYMALBAWORKM b ON a.CSTCO = b.CSTCO and a.USERID = b.USERID 
            inner join MinWageCTE m On 1 = 1
        WHERE a.CSTCO = @cstCo
`
const getAbsent = `
    -- 결근 데이터 가져오기
	select CSTCO, YMD, USERID, ISNULL(MUSERID, IUSERID) WHO
	from PLYADAYABSENT 
	where CSTCO = @cstCo
	AND USEYN = 'Y'
	and YMD between @ymdFr AND @ymdTo
`
const getWageById = `
		WITH MinWageCTE AS (
            SELECT TOP 1 WAGE
            FROM MINWAGE
            WHERE VALIDFROM <= GETDATE()
            ORDER BY VALIDFROM DESC
        )
        SELECT a.USERID, a.CSTCO, ISNULL(b.JOBTYPE, 'H') JOBTYPE, ISNULL(b.BASICWAGE, m.WAGE) WAGE, isnull(b.MEALALLOWANCE, 0) MEALALLOWANCE
        FROM PLYMCSTUSER a 
            left JOIN PLYMALBAWORKM b ON a.CSTCO = b.CSTCO and a.USERID = b.USERID 
            inner join MinWageCTE m On 1 = 1
        WHERE a.USERID = @userId
`


module.exports = { albaWorkManager, monthCstSlySearch, getWage, getAbsent, getWageById}

