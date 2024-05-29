
const insertManualJobChk = `
    INSERT	PLYAJOBCHK(CSTCO, USERID, YMD, LAT, LON, CHKYN, APVYN, JOBCL, CHKTIME)
    VALUES ( @cstCo, @userId, CONVERT(CHAR(8), getDate(), 112), @lat, @lon, @chkYn, @apvYn, @jobCl, getDate())
`
const updatePLYADAYJOB=`
    update a set a.STARTTIME = @sTime, a.ENDTIME  = @eTime, a.JOBDURE = DATEDIFF(minute, @sTime, @eTime), a.MUSERID = @userId, a.MYMDHMD = GETDATE() 
    from PLYADAYJOB a WHERE JOBNO = @jobNo
`
const insertPLYADAYJOB=`
    INSERT INTO PLYADAYJOB (CSTCO, USERID, YMD, JOBCL, STARTTIME, STARTCHKNO, ENDTIME, ENDCHKNO, JOBDURE, STAT, APVYN, AUSERID, AYMDHMD, USEYN, IUSERID, IYMDHMD)
    --OUTPUT INSERTED.JOBNO
    select CSTCO, USERID, YMD, 'G', STIME, null, ETIME, null, DATEDIFF(minute, STIME, ETIME), 'X', 'R', @userId, getdate(), 'Y', @userId, getdate()
    FROM PLYADAYJOBREQ
    WHERE REQNO = @reqNo
`
const getReqNo = `
    select REQNO
    from PLYADAYJOBREQ
    WHERE a.USERID = @userId and a.YMD = @ymd and b.USEYN = 'Y'
`
const getJobNo=`
    select b.JOBNO
    FROM PLYADAYJOBREQ a
    inner join PLYADAYJOB b ON a.CSTCO = b.CSTCO and a.USERID = b.USERID and a.YMD = b.YMD and b.USEYN = 'Y'
    WHERE a.REQNO = @reqNo
`

const daySchedule = `
    exec PR_PLYA02_ALBASCHMNG @cls, @cstCo, @userId, @ymdFr, @ymdTo, '', '', ''
`
const reqCommuteChange = `
    INSERT INTO PLYADAYJOBREQ (CSTCO, USERID, JOBNO, STIME, ETIME, STARTTIME, ENDTIME, REASON, REQSTAT, YMD, PUSHYN, USEYN,  IUSERID, IYMDHMD)
    OUTPUT INSERTED.REQNO
    VALUES(@cstCo, @userId, @jobNo, @sTime, @eTime, @startTime, @endTime, @reason, @reqStat,  @ymd, 'N', 'Y', @userId, getdate())
`
const initCommuteChange = `
    UPDATE a set a.USEYN = 'N', a.MUSERID=@userId, a.MYMDHMD = getdate()
    from PLYADAYJOBREQ a 
    WHERE CSTCO = @cstCo 
    AND USERID = @userId
    AND YMD = @ymd
    AND JOBNO = @jobNo
    AND USEYN = 'Y'
`

// 결근 처리로 APVYN이 0 인경우는 결근 처리후 원래 있던 APVYN이 D(점주 거절)인 경우에는 앱에서 필터링한다.
const getReqCommuteList = `
    SELECT isnull(b.APVYN, '0')apvYn, a.REQNO, u.USERID, c.CSTCO, d.CSTNA, alba.USERNA, a.JOBNO, a.STIME reqStime, a.ETIME reqEtime, a.YMD, a.STARTTIME sTime, a.ENDTIME eTime, a.REASON, a.REQSTAT, a.IYMDHMD createDate
    FROM PLYADAYJOBREQ a
    left join PLYADAYJOB b ON a.JOBNO = b.JOBNO
    inner join PLYMCSTUSER c ON a.CSTCO = c.CSTCO 
    inner join PLYMCST d On c.CSTCO = d.CSTCO
    inner join PLYMUSER u On c.USERID = u.USERID
    inner join PLYMUSER alba On a.USERID = alba.USERID
    WHERE a.USEYN = 'Y'
    --and b.APVYN != 'D'
    and d.USEYN = 'Y'
    AND c.ROLECL = 'ownr'
    AND u.USERID = @userId
    --AND a.YMD BETWEEN @firstDay AND @lastDay;
`
const getReqCommuteListForDay=`
    SELECT isnull(b.APVYN, '0') apvYn, a.REQNO, u.USERID, c.CSTCO, d.CSTNA, alba.USERNA, a.JOBNO, a.STIME reqStime, a.ETIME reqEtime, a.YMD, a.STARTTIME sTime, a.ENDTIME eTime, a.REASON, a.REQSTAT, a.IYMDHMD createDate
    FROM PLYADAYJOBREQ a
    left join PLYADAYJOB b ON a.JOBNO = b.JOBNO
    inner join PLYMCSTUSER c ON a.CSTCO = c.CSTCO 
    inner join PLYMCST d On c.CSTCO = d.CSTCO
    inner join PLYMUSER u On c.USERID = u.USERID
    inner join PLYMUSER alba On a.USERID = alba.USERID
    WHERE a.USEYN = 'Y'
    and b.USEYN = 'Y'
    --and b.APVYN != 'D'
    and d.USEYN = 'Y'
    AND c.ROLECL = 'ownr'
    AND u.USERID = @userId
    AND a.YMD = @ymd
    AND a.CSTCO = @cstCo
`
const getReqCommuteListForMonth = `
    SELECT isnull(b.APVYN, '0') apvYn, a.REQNO, u.USERID, c.CSTCO, d.CSTNA, alba.USERNA, a.JOBNO, a.STIME reqStime, a.ETIME reqEtime, a.YMD, a.STARTTIME sTime, a.ENDTIME eTime, a.REASON, a.REQSTAT, a.IYMDHMD createDate
    FROM PLYADAYJOBREQ a
    left join PLYADAYJOB b ON a.JOBNO = b.JOBNO
    inner join PLYMCSTUSER c ON a.CSTCO = c.CSTCO 
    inner join PLYMCST d On c.CSTCO = d.CSTCO
    inner join PLYMUSER u On c.USERID = u.USERID
    inner join PLYMUSER alba On a.USERID = alba.USERID
    WHERE a.USEYN = 'Y'
    and b.USEYN = 'Y'
    --and b.APVYN != 'D'
    and d.USEYN = 'Y'
    AND c.ROLECL = 'ownr'
    AND u.USERID = @userId
    AND a.YMD between @ymdTo and @ymdFr
    AND a.CSTCO = @cstCo
`

//점주 알바 수정 요청 승인 쿼리 - 결근 외
const updateJobReq = `
    UPDATE PLYADAYJOBREQ SET REQSTAT = @reqStat, MUSERID = @userId, MYMDHMD = getdate()
    WHERE REQNO = @reqNo
`
//점주 알바 수정 요청 승인 쿼리 - 결근시
const updateJobReqAbsence = `
    UPDATE PLYADAYJOBREQ SET JOBNO = @jobNo, REQSTAT = @reqStat, MUSERID = @userId, MYMDHMD = getdate()
    WHERE REQNO = @reqNo
`

const updateDayJob = `
    UPDATE a set a.APVYN = @apvYn, a.MUSERID = @userId, a.MYMDHMD = getdate(), a.STARTTIME = b.STIME, a.ENDTIME = b.ETIME, a.JOBDURE = DATEDIFF(minute,  b.STIME, b.ETIME), a.STAT = 'X'
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


module.exports = {insertManualJobChk, insertPLYADAYJOB, daySchedule, reqCommuteChange, initCommuteChange, getReqCommuteList, getReqCommuteListForDay, getReqCommuteListForMonth, updateJobReq, updateJobReqAbsence, updateDayJob, getDAYJOBREQ, getJobNo, updatePLYADAYJOB}