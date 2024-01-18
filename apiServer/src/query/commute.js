
const insertManualJobChk = `
    INSERT	PLYAJOBCHK(CSTCO, USERID, YMD, LAT, LON, CHKYN, APVYN, JOBCL, CHKTIME)
    VALUES ( @cstCo, @userId, CONVERT(CHAR(8), getDate(), 112), @lat, @lon, @chkYn, @apvYn, @jobCl, getDate())
`
const daySchedule = `
    exec PR_PLYA02_ALBASCHMNG @cls, @cstCo, @userId, @ymdFr, @ymdTo, '', '', ''
`
const reqCommuteChange = `
    INSERT INTO PLYADAYJOBREQ (CSTCO, USERID, JOBNO, STIME, ETIME, REASON, REQSTAT, USEYN, IUSERID, IYMDHMD)
    VALUES(@cstCo, @userId, @jobNo, @sTime, @eTime, @reason, @reqStat, 'Y', @userId, getdate())
`
const initCommuteChange = `
    UPDATE a set a.USEYN = 'N', a.MUSERID=@userId, a.MYMDHMD = getdate()
    from PLYADAYJOBREQ a 
    WHERE CSTCO = @cstCo 
    AND USERID = @userId
    AND JOBNO = @jobNo
    AND USEYN = 'Y'
`

module.exports = {insertManualJobChk, daySchedule, reqCommuteChange, initCommuteChange}