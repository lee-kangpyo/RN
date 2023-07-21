const login = `
    SELECT	PWDCOMPARE(@passWord, a.CRPYPW) pwCheck, a.ownrYn, a.mnrgYn, a.crewYn, a.userNa
    FROM	PLYMUSER a
    WHERE	a.USERID = @userId
`
const test = `
    SELECT * 
    FROM PLYMUSER 
    WHERE USERID = @userId 
    or USERID != @userId 
`

const isIdDuplicate = `
    SELECT count(*) cnt
    FROM PLYMUSER 
    WHERE USERID = @userId 
`
const saveUser = `
    INSERT INTO PLYMUSER(USERID, USERNA, [PASSWORD], HPNO, STATCO, USEYN, IUSERID, IYMDHMD, CRPYPW, OWNRYN, MNRGYN, CREWYN)
    VALUES(@userId, @userName, @passWord, @hpNo, '00', 'Y', @userId, GETDATE(), PWDENCRYPT(@passWord), @ownrYn, @mnrgYn, @crewYn)
`

//사업장 조회
const getStoreList = `
    SELECT   a.CSTCO
    , a.CSTNA
    , a.CSTCL
    , dbo.FN_TAXNO(a.TAXNO) as TAXNO
    , a.ZIPNO
    , a.ZIPADDR + ' ' + a.ADDR as ADDR1
    , a.ZIPADDR
    , a.ADDR
    , ISNULL(a.LAT,0) as LAT
    , ISNULL(a.LON,0) as LON
    , ISNULL(a.MNGNA,'') as MNGNA
    , ISNULL(b.CNT,0)+95   as CNT      -- 조회수
    FROM   PLYMCST a
    left join (SELECT a.CSTCO, COUNT(1) CNT FROM PLYMCSTCHK a GROUP   BY a.CSTCO) b On a.CSTCO = b.CSTCO
    inner join PLYMCSTUSER c On a.CSTCO = c.CSTCO
    WHERE c.USERID = @userId 
    --  AND   a.CSTCO = @CSTCO
    --  AND   a.CSTNA like '%'+@cstNa+'%'
`
//사업장 조회
const getStoreListCrew = `
    SELECT   a.CSTCO
    , a.CSTNA
    , a.CSTCL
    , dbo.FN_TAXNO(a.TAXNO) as TAXNO
    , a.ZIPNO
    , a.ZIPADDR + ' ' + a.ADDR as ADDR1
    , a.ZIPADDR
    , a.ADDR
    , ISNULL(a.LAT,0) as LAT
    , ISNULL(a.LON,0) as LON
    , ISNULL(a.MNGNA,'') as MNGNA
    , ISNULL(b.CNT,0)+95   as CNT      -- 조회수
    FROM   PLYMCST a
    left join (SELECT a.CSTCO, COUNT(1) CNT FROM PLYMCSTCHK a GROUP   BY a.CSTCO) b On a.CSTCO = b.CSTCO
    inner join PLYMCSTUSER c On a.CSTCO = c.CSTCO
    WHERE   a.CSTNA like '%'+@cstNa+'%'
`

// 사업장 등록
const insertMCST = `
    INSERT INTO PLYMCST(CSTNA, CSTCL, TAXNO, ZIPNO, ZIPADDR, ADDR, REPNA, CONFYN, LAT, LON, USEYN, IUSERID, IYMDHMD)
    OUTPUT INSERTED.CSTCO
    VALUES(@cstNa, @cstCl, @taxNo, @zipNo, @zipAddr, @addr, @repNa, 'N', @lat, @lon, 'Y', @userId, getdate())
`
const insertMCSTUSER = `
    INSERT INTO PLYMCSTUSER(CSTCO, USERID, ROLECL, JOBTYPE, WAGE, RTCL, IUSERID, IYMDHMD)
    VALUES(@cstCo, @userId, @ROLECL, null, null, @rtCl, @iUserId, GETDATE())
`

const searchCrewList = `
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
    FROM   PLYMCSTUSER a
    inner join PLYMCST b On a.CSTCO = b.CSTCO
    inner join PLYMUSER c On a.USERID = c.USERID
    left join PLYAJOBDAY d On a.CSTCO = d.CSTCO AND a.USERID = d.USERID
    WHERE   a.CSTCO in (SELECT CSTCO FROM PLYMCSTUSER a WHERE a.USERID = @userId AND a.ROLECL in ('OWNR','MNGR'))      -- 거래처코드
    AND   a.USERID != @userId
    AND   a.RTCL not in ( 'Y' )        -- Y - 퇴직, N - 재직, R - 요청 <-- 추후 생성
    GROUP   BY a.CSTCO, b.CSTNA, a.USERID, c.USERNA, ISNULL(c.NICKNA,''), a.JOBTYPE, a.WAGE, a.ROLECL, a.RTCL
`

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

const changeCrewRTCL=`
    UPDATE a SET a.RTCL = @rtCl, a.MUSERID = @userId , a.MYMDHMD = getdate()
    FROM PLYMCSTUSER a
    WHERE a.USERID = @userId
    AND a.CSTCO = @cstCo 
`

const getSelStoreRecords=`
    SELECT   dbo.FN_DATE(a.CHKTIME,1) CHKTIME
        , a.JOBYN   -- 'Y' 출근, 'N' 퇴근, 'P' 긴급(추가작업)
        , a.DAY
        , a.APVYN   -- 점주 인정여부, 'Y' 자동승인, 'N' 자동불인, 'A' 점주승인, 'D' 점주불인
    FROM   PLYAJOBCHK a
    WHERE   a.CSTCO = @cstCo
    AND   CONVERT(nvarchar(8),a.CHKTIME,11) = CONVERT(nvarchar(8),getdate(),11)
    AND   a.USERID = @userId
    ORDER   BY a.CHKTIME
`
// 출퇴근 기록
const insertJobChk = `
    INSERT	PLYAJOBCHK(CSTCO, USERID, DAY, LAT, LON, JOBYN, APVYN, CHKTIME)
    VALUES ( @cstCo, @userId, @day, @lat, @lon, @jobYn, @apvYn, dateadd(MINUTE, -60, getdate()))
`

const geofencingTest = `
    insert into GEOFENCINGTEST(id, name, lat, lon, day)
    VALUES (@id, @name, @lat, @lon, @day)
`

module.exports = {login, test, isIdDuplicate, saveUser, getStoreList, insertMCST, insertMCSTUSER, getStoreListCrew, searchCrewList, changeCrewRTCL, searchMyAlbaList, getSelStoreRecords, insertJobChk, geofencingTest}