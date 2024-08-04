const searchAlbaWork = `
    exec PR_PLYM03_ALBAMNG 'searchAlbaWork', @cstCo, @userId, '', 0, '', '', 0, '', '', '', ''
`
const saveAlbaWork  = `
    exec PR_PLYM03_ALBAMNG 'saveAlbaWork', @cstCo, @userId, @jobType, @mealAllowance, @isWeekWage, @isSch, @wage, '', '', '', @iUserId
`
const saveAlbaJobTime  = `
    exec PR_PLYM03_ALBAMNG 'saveAlbaJobTime', @cstCo, @userId, '', 0, '', '', 0, @week, @sTime, @eTime, @iUserId
`
const delAlbaJobTime  = `
    --DELETE FROM PLYMALBAWORKS WHERE CSTCO = @cstCo AND USERID = @userId and JOBWEEK = @week
    exec PR_PLYM03_ALBAMNG 'deleteAlbaJobTime', @cstCo, @userId, '', 0, '', '', 0, @week, '', '', @iUserId

`
const delAllAlbaJobTime  = `
    DELETE FROM PLYMALBAWORKS WHERE CSTCO = @cstCo AND USERID = @userId
`

const searchStoreByAlba = `
    SELECT a.CSTCO, a.RTCL, b.CSTNA, b.ZIPNO, b.ZIPADDR, b.ADDR, b.LAT, b.LON, c.JOBTYPE, c.MEALALLOWANCE, c.WEEKWAGEYN, c.ISSCHYN, c.BASICWAGE
    from PLYMCSTUSER a  
    INNER JOIN PLYMCST b On a.cstco = b.cstco and b.USEYN ='Y'
    left JOIN PLYMALBAWORKM c On a.USERID = c.USERID and a.CSTCO =c.CSTCO 
    WHERE a.userid = @userId and a.ROLECL = 'CREW'
`
const searchWeekByAlba = `
    select * from PLYMALBAWORKS where USERID = @userId
`


const updateAlbaInfo = `
    UPDATE a SET a.JOBTYPE = @jobType, a.WAGE = @wage, a.MEALALLOWANCE = @mealAllowance, a.ISWEEKWAGE = @isWeekWage, a.ISSCH = @isSch, MUSERID = @iUserId, MYMDHMD = GETDATE() 
    FROM PLYMCSTUSER a WHERE a.CSTCO = @cstCo AND a.USERID = @userId
`
const mergeAlbaWeekInfo = `
    IF EXISTS(
	    select * FROM PLYMCSTFIXEDSCH a WHERE a.CSTCO = @cstCo AND a.USERID = @userId AND a.WEEK = @week AND USEYN = 'Y'
    )
    BEGIN 
        UPDATE a SET a.STIME=@sTime, a.ETIME = @eTime, a.JOBDURE = @jobDure, a.WEEK = @week, a.MUSERID = @iUserid, a.MYMDHMD = GETDATE()  
        FROM PLYMCSTFIXEDSCH a WHERE a.CSTCO = @cstCo AND a.USERID = @userId AND a.week = @week AND USEYN = 'Y'
    END
    ELSE
    BEGIN 
        INSERT INTO PLYMCSTFIXEDSCH (CSTCO, USERID, STIME, ETIME, JOBDURE, [WEEK], USEYN, IUSERID, IYMDHMD)
        VALUES (@cstCo, @userId, @sTIme, @eTime, @jobDure, @week, 'Y', @iUserId, GETDATE())
    END
`
const UseNAlbaWeekInfo = `
    UPDATE a SET a.USEYN = 'N', a.MUSERID = @iUserid, a.MYMDHMD = GETDATE()   
    FROM PLYMCSTFIXEDSCH a WHERE a.CSTCO = @cstCo AND a.USERID = @userId AND a.WEEK = @week AND USEYN = 'Y'
`
const UseNAlbaWeeksInfo = `
    UPDATE a SET a.USEYN = 'N', a.MUSERID = @iUserid, a.MYMDHMD = GETDATE()   
    FROM PLYMCSTFIXEDSCH a WHERE a.CSTCO = @cstCo AND a.USERID = @userId AND USEYN = 'Y'
`

module.exports = {searchAlbaWork, saveAlbaWork, saveAlbaJobTime, delAlbaJobTime, delAllAlbaJobTime,
                    searchStoreByAlba, searchWeekByAlba,
                    updateAlbaInfo, mergeAlbaWeekInfo, UseNAlbaWeekInfo, UseNAlbaWeeksInfo}