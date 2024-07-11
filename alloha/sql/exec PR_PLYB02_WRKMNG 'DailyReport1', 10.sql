exec PR_PLYB02_WRKMNG  'DailyReport1', 1010, '', '20231240', '', ''

select * from plymuser
select * from PLYAJOBCHK
select * from PLYADAYJOB where STARTCHKNO != 0

select * from PLYADAYJOBREQ

p 는 자동 승인 R 이면 승인대기 -> A
P 자동 승인
R 승인대기
A 승인
D 불인

김지수가 일한테이블에서 상태코드가 R인얘들
/*
JOBNO : 자동증가생성됨.
CSTCO : 점포 코드
USERID : 알바 아이디
YMD : 요청 날짜
JOBCL : G 
STARTTIME : 출근시간
STARTCHKNO : ???
ENDTIME : 퇴근시간
ENDCHKNO : ???
JOBDURE : 근무시간
STAT : Y
APVYN : Y
AUSERID : 점주 아이디?
AYMDHMD : 승인시간
USEYN : Y
IUSERID : 점주 아이디
IYMDHMD : 생성일
MUSERID : null
MYMDHMD : null
*/

이사님 제가 아래 같은 정보를 토대로 점주가 승인했을때를 가정하고 데이터를 넣어보았습니다.
알바아이디 Sksksksk 
점포번호 1003  
20231224 결근 한내역

insert 쿼리는 아래와 같고

INSERT INTO PLYADAYJOB (CSTCO, USERID, YMD, JOBCL, STARTTIME, STARTCHKNO, ENDTIME, ENDCHKNO, JOBDURE, STAT, APVYN, AUSERID, AYMDHMD, USEYN, IUSERID, IYMDHMD)
values('1003', 'Sksksksk', '20231224', 'G', '2023-12-24 07:00:00.000', null, '2023-12-24 12:00:00.000', null, '5', 'Y', 'A', 'test', GETDATE(), 'Y', 'test', GETDATE())

아래 쿼리를 확인했을때는 제대로 출력이 되는것을 확인했습니다.
select * from PLYADAYJOB a where YMD = '20231224' and JOBNO = '1936'

그런데 근무 정보를 보니 일반에 0.083333 시간을 일한걸로 나오는데 어떻게 된걸까요?


select REQNO, JOBNO, STARTTIME, ENDTIME, STIME, ETIME, REASON, REQSTAT, USEYN
from PLYADAYJOBREQ where JOBNO = 4631 AND USEYN = 'Y'
select * from PLYAJOBCHK order by YMD desc


select * from PLYAJOBCHK where YMD = '20240228' order by CHKTIME

select * 
-- UPDATE a set a.ENDTIME = null, a.ENDCHKNO = null
-- UPDATE a set a.STARTTIME = '2024-02-28 14:30:00.000'
from PLYADAYJOB a where a.STARTCHKNO = '2355'

select * 
-- update a set a.JOBDURE = DATEDIFF(minute, STARTTIME, ENDTIME)
-- update a set a.STARTTIME = '2024-02-28 15:00:00.000'
from PLYADAYJOB a where a.JOBNO = '1994'


INSERT INTO PLYADAYJOB (CSTCO, USERID, YMD, JOBCL, STARTTIME, STARTCHKNO, ENDTIME, ENDCHKNO, JOBDURE, STAT, APVYN, AUSERID, AYMDHMD, USEYN, IUSERID, IYMDHMD)
values('1003', 'Sksksksk', '20231224', 'G', '2023-12-24 07:00:00.000', null, '2023-12-24 12:00:00.000', null, '5', 'Y', 'A', 'test', GETDATE(), 'Y', 'test', GETDATE())

INSERT      PLYAJOBCHK(CSTCO, USERID, YMD, LAT, LON, CHKYN, APVYN, JOBCL, CHKTIME, STAT)
VALUES ( '1003', 'Sksksksk', CONVERT(CHAR(8), getDate(), 112), '37.541567', '127.0928243', 'X', 'Y', 'G', getDate(), 'S')

exec PR_PLYB02_WRKMNG 'DailyReport1', 1003, '', 20240214, '', ''

select * 
-- update a set a.USERNA = 'dj알바'
from PLYMUSER a where userid = 'Djdjdjdj'

    UPDATE PLYADAYJOB SET APVYN = 'R', MUSERID = 'test', MYMDHMD = getdate() 
    WHERE JOBNO in (1974, 1978)

exec PR_PLYB02_WRKMNG 'DailyReport1', 1003, '', 20240215, '', ''

    SELECT   *
      FROM   PLYADAYJOBREQ a
      WHERE   1=1--a.USEYN = 'Y'
      AND   a.CSTCO = 1003
      AND   a.REQSTAT = 'R'
   --   GROUP   BY a.USERID, a.REQNO


   SELECT   *
      FROM   PLYADAYJOBREQ a order by REQNO 

      select * from PLYADAYJOB order by JOBNO desc
      select * from PLYADAYJOB where userid = 'medic2wo'

      select * from PLYMUSER where USERID =  'mangdee22'


      exec PR_PLYC02_JOBCHECK 'dayJobInfo', '20240218', '20240224', '1014', 'medic2wo'

exec PR_JOB_CLOSE 'jobToSalary', '20240202', '20240202', '1003', "", 'Y'

    UPDATE PLYADAYJOB SET APVYN = 'R'
    WHERE JOBNO in (1920)


      select * 
      -- UPDATE a set a.WAGE='9860', a.RTCL = 'N'
      -- UPDATE a set a.WAGE=null, a.RTCL = 'R'
      from PLYMCSTUSER a 
      where a.cstco = '1004' 
      and a.USERID = 'Sksksksk'
      
      select * from PLYMCST

      select * from PLYADAYJOB where jobno = '1974'
      select  CONVERT(CHAR(8), STARTTIME, 112), * 
      --UPDATE a SET a.YMD =  CONVERT(CHAR(8), STARTTIME, 112)
      from PLYADAYJOBREQ a where REQNO in ('18', '20', '23', '29')



delete from  PLYADAYJOB

select * from PLYADAYJOB_20231215
SET IDENTITY_INSERT PLYADAYJOB OFF

select Max(JOBNO) from PLYADAYJOB
-- delete from PLYADAYJOB where JOBNO = 2521

-- INSERT INTO PLYADAYJOB (CSTCO, USERID, YMD, JOBCL, STARTTIME, STARTCHKNO, ENDTIME, ENDCHKNO, JOBDURE, STAT, APVYN, AUSERID, AYMDHMD, USEYN, IUSERID, IYMDHMD)
select CSTCO, USERID, YMD, 'G', STIME, null, ETIME, null, DATEDIFF(minute, STIME, ETIME), 'Y', 'A', 'Qpqpqpqp', getdate(), 'Y', 'Qpqpqpqp', getdate()
FROM PLYADAYJOBREQ
WHERE REQNO = 38

select *
FROM PLYADAYJOBREQ
WHERE REQNO = 38



select * 
-- update a set a.REQSTAT = 'R', a.JOBNO = 0
from PLYADAYJOBREQ a WHERE a.REQNO in (38, 39, 30, 40)

select * from PLYADAYJOB_20231215






    SELECT isnull(b.APVYN, '0') apvYn, a.REQNO, u.USERID, c.CSTCO, d.CSTNA, alba.USERNA, a.JOBNO, a.STIME reqStime, a.ETIME reqEtime, a.YMD, a.STARTTIME sTime, a.ENDTIME eTime, a.REASON, a.REQSTAT, a.IYMDHMD createDate    
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
    AND u.USERID = 'Qpqpqpqp'
    AND a.YMD = '20240227'
    AND a.CSTCO = '1004'


select * from PLYMCSTUSER where userid = 'Qwerasdf'

select * from plygmsgm

select * 
--update a set a.Token = ''
from PLYMUSER a where isnull(token, '') != ''

select * -- into PLYMCSTUSER_20240503
-- update a set a.wage = '9860'
from PLYMCSTUSER a where wage != 9860




SELECT OBJECT_NAME(object_id), 
 OBJECT_DEFINITION(object_id)
FROM sys.procedures
WHERE OBJECT_DEFINITION(object_id) LIKE '%9620%'


SELECT ROUTINE_NAME 
FROM INFORMATION_SCHEMA.ROUTINES
WHERE ROUTINE_DEFINITION LIKE '%'+'9620' +'%'
AND ROUTINE_TYPE='FUNCTION'
order by ROUTINE_NAME;

SELECT ROUTINE_NAME 
FROM INFORMATION_SCHEMA.ROUTINES
WHERE ROUTINE_DEFINITION LIKE '%'+'9620' +'%'
AND ROUTINE_TYPE='FUNCTION'
order by ROUTINE_NAME;

DECLARE @search_text VARCHAR(MAX) = '9620';

select 
 A.name AS job_name, A.enabled AS isUse, A.description,
 B.step_id, B.step_name, B.database_name, B.command
FROM msdb.dbo.sysjobs A
INNER JOIN msdb.dbo.sysjobsteps B ON A.job_id = B.job_id
WHERE B.command LIKE '%'+@search_text+'%'
ORDER BY A.name ASC, B.step_id ASC

