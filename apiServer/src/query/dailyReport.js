
const DailyReport1 = `
    exec PR_PLYB02_WRKMNG 'DailyReport1', @cstCo, '', @ymd, '', '', '', 0
`

const approve = `
    UPDATE PLYADAYJOB SET APVYN = 'A', MUSERID = @userId, MYMDHMD = getdate() 
    WHERE JOBNO in `

const jobClose = `
    exec PR_JOB_CLOSE 'jobToSalary', @ymdFr, @ymdTo, @cstCo, '', 'Y'
`
const JumjoWorkSave = `
    exec PR_PLYB02_WRKMNG @cls, @cstCo, @useId, @ymd, @sTime, @eTime, @jobCl, @brkDure
`

const useN_DayJob = `
    update b set b.USEYN  = 'N'
    from PLYADAYJOBREQ a
    inner join PLYADAYJOB b On a.JOBNO = b.JOBNO 
    where a.STARTTIME = '1900-01-01 00:00:00.000' 
    and a.ENDTIME = '1900-01-01 00:00:00.000' 
    and REQNO = @reqNo
`

const sendMsg_Z0110_11 = `
    INSERT INTO PLYGMSGSEND(YMD, CSTCO, CREATEDATE, SENDID, RECIVEID, MSGID, CONTENT, TOKEN, LINK)
    SELECT	p.YMD, p.CSTCO, GETDATE(), p.SENDID, p.RECIVEID, a.MSGID
            , REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(a.CONTENT, '{cstNa}', p.CSTNA), '{ymd}', p.YMD), '{sTime}', p.sTime), '{eTime}', p.eTime), '{statNa}', p.statNa) CONTENT
            , p.TOKEN, a.LINK
    FROM PLYGMSGM a
    inner join (
                    select	b.CSTNA, SUBSTRING(a.YMD, 1, 4)+'년 '+SUBSTRING(a.YMD, 5, 2)+'월 '+SUBSTRING(a.YMD, 7, 2)+'일' ymdNa, FORMAT(a.STIME, 'hh:mm') sTime, FORMAT(a.ETIME, 'hh:mm') eTime, 
                            CASE a.REQSTAT WHEN 'A' THEN '승인' 
                                        WHEN 'D' THEN '거절'
                                        ELSE '' END statNa,
                            a.YMD, a.CSTCO, j.USERID SENDID, u.USERID RECIVEID, u.TOKEN
                    from PLYADAYJOBREQ a
                    inner join PLYMCST b ON a.CSTCO = b.CSTCO
                    inner join PLYMCSTUSER cu On b.CSTCO = cu.CSTCO and cu.ROLECL  ='ownr'
                    inner join PLYMUSER j On cu.USERID = j.USERID
                    inner join PLYMUSER u On a.USERID = u.USERID
                    where a.REQNO  = @reqNo     
                    AND a.REQSTAT in ('A', 'D')
                ) p On 1 = 1
    WHERE a.MSGID = 'Z0110_11'
    AND CONVERT(CHAR(8), GETDATE(), 112) BETWEEN a.YMDFR AND a.YMDTO 
    AND USEYN = 'Y'
`

module.exports = { DailyReport1, approve, jobClose, JumjoWorkSave, sendMsg_Z0110_11, useN_DayJob }