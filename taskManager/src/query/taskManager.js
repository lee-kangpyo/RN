const searchMyAlbaList = `
    SELECT   a.CSTCO
            , b.CSTNA
            , a.USERID
            , c.USERNA
            , ISNULL(c.NICKNA,'') as NICKNA
            , a.JOBTYPE
            , a.WAGE
            , a.ROLECL
            , a.RTCL
            , ISNULL(MIN(JOBFR) + '~' + MAX(JOBTO),'등록전') as JOBDUR
            , ISNULL(SUM(DAYJOB),0) as WEEKJOB 
            , b.LAT
            , b.LON
    FROM   PLYMCSTUSER a
    inner join PLYMCST b On a.CSTCO = b.CSTCO
    inner join PLYMUSER c On a.USERID = c.USERID
    left join PLYAJOBDAY d On a.CSTCO = d.CSTCO AND a.USERID = d.USERID
    WHERE   a.USERID = @userId
    AND   a.RTCL not in ( 'Y' )      -- Y - 퇴직, N - 재직, R - 요청 <-- 추후 생성
    GROUP   BY a.CSTCO, b.CSTNA, a.USERID, c.USERNA, ISNULL(c.NICKNA,''), a.JOBTYPE, a.WAGE, a.ROLECL, a.RTCL, b.lat, b.lon
`

// 출퇴근 기록
const insertJobChk = `
    INSERT	PLYAJOBCHK(CSTCO, USERID, DAY, LAT, LON, JOBYN, APVYN, CHKTIME)
    VALUES ( @cstCo, @userId, @day, @lat, @lon, @jobYn, @apvYn, getDate())
`

//출퇴근 상태 체크
const checkJobChk = `
    SELECT  top 1 a.JOBYN, a.CSTCO
    FROM   PLYAJOBCHK a
    WHERE   a.USERID = @userId
    AND   dbo.FN_DATE(a.CHKTIME,4) =  dbo.FN_DATE(getdate(),4)
    ORDER   BY a.CHKTIME desc
`

const getUUID = `
    select UUID from PLYMUSER WHERE USERID = @userId
`

const MyuserTrace = `
    INSERT INTO PLYUSERTRACE(USERID, CSTCO, JOBYN, LAT, LON, UUID, CHKTIME, DATE)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
`

module.exports = {searchMyAlbaList, insertJobChk, checkJobChk, getUUID, MyuserTrace}