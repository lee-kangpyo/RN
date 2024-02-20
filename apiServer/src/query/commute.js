
const insertManualJobChk = `
    INSERT	PLYAJOBCHK(CSTCO, USERID, YMD, LAT, LON, CHKYN, APVYN, JOBCL, CHKTIME)
    VALUES ( @cstCo, @userId, CONVERT(CHAR(8), getDate(), 112), @lat, @lon, @chkYn, @apvYn, @jobCl, getDate())
`
const daySchedule = `
    exec PR_PLYA02_ALBASCHMNG @cls, @cstCo, @userId, @ymdFr, @ymdTo, '', '', ''
`
const reqCommuteChange = `
    INSERT INTO PLYADAYJOBREQ (CSTCO, USERID, JOBNO, STIME, ETIME, STARTTIME, ENDTIME, REASON, REQSTAT, YMD, PUSHYN, USEYN,  IUSERID, IYMDHMD)
    VALUES(@cstCo, @userId, @jobNo, @sTime, @eTime, @startTime, @endTime, @reason, @reqStat,  @ymd, 'N', 'Y', @userId, getdate())
`
const initCommuteChange = `
    UPDATE a set a.USEYN = 'N', a.MUSERID=@userId, a.MYMDHMD = getdate()
    from PLYADAYJOBREQ a 
    WHERE CSTCO = @cstCo 
    AND USERID = @userId
    AND JOBNO = @jobNo
    AND USEYN = 'Y'
`

const getReqCommuteList = `
    SELECT a.REQNO, u.USERID, c.CSTCO, d.CSTNA, alba.USERNA, a.JOBNO, a.STIME reqStime, a.ETIME reqEtime, b.YMD, a.STARTTIME sTime, a.ENDTIME eTime, a.REASON, a.REQSTAT, a.IYMDHMD createDate
    FROM PLYADAYJOBREQ a
    inner join PLYADAYJOB b ON a.JOBNO = b.JOBNO
    inner join PLYMCSTUSER c ON a.CSTCO = c.CSTCO 
    inner join PLYMCST d On c.CSTCO = d.CSTCO
    inner join PLYMUSER u On c.USERID = u.USERID
    inner join PLYMUSER alba On a.USERID = alba.USERID
    WHERE a.USEYN = 'Y'
    and b.APVYN != 'D'
    and d.USEYN = 'Y'
    AND c.ROLECL = 'ownr'
    AND u.USERID = @userId
    AND a.YMD BETWEEN @firstDay AND @lastDay;
`

//점주 알바 수정 요청 승인 쿼리
const updateJobReq = `
    UPDATE PLYADAYJOBREQ SET REQSTAT = @reqStat, MUSERID = @userId, MYMDHMD = getdate()
    WHERE REQNO = @reqNo
`
const updateDayJob = `
    UPDATE a set a.APVYN = @apvYn, a.MUSERID = @userId, a.MYMDHMD = getdate(), a.STARTTIME = b.STIME, a.ENDTIME = b.ETIME
    FROM PLYADAYJOB a 
    inner join PLYADAYJOBREQ b On a.JOBNO = b.JOBNO
    WHERE b.REQNO = @reqNo
`
//점주 알바 수정 요청 승인 쿼리

//알바 수정 요청 페이지 호출 쿼리
const getDAYJOBREQ = `
    select REQNO, JOBNO, STARTTIME, ENDTIME, STIME, ETIME, REASON, REQSTAT, USEYN
    from PLYADAYJOBREQ where JOBNO = @jobNo AND USEYN = 'Y'
`


module.exports = {insertManualJobChk, daySchedule, reqCommuteChange, initCommuteChange, getReqCommuteList, updateJobReq, updateDayJob, getDAYJOBREQ}