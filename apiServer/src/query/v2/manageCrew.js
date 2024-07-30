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
    DELETE FROM PLYMALBAWORKS WHERE CSTCO = @cstCo AND USERID = @userId and JOBWEEK = @week
`
const delAllAlbaJobTime  = `
    DELETE FROM PLYMALBAWORKS WHERE CSTCO = @cstCo AND USERID = @userId
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
                    updateAlbaInfo, mergeAlbaWeekInfo, UseNAlbaWeekInfo, UseNAlbaWeeksInfo}