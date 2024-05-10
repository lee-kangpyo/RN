
const DailyReport1 = `
    exec PR_PLYB02_WRKMNG 'DailyReport1', @cstCo, '', @ymd, '', ''
`

const approve = `
    UPDATE PLYADAYJOB SET APVYN = 'A', MUSERID = @userId, MYMDHMD = getdate() 
    WHERE JOBNO in `

const jobClose = `
    exec PR_JOB_CLOSE 'jobToSalary', @ymdFr, @ymdTo, @cstCo, '', 'Y'
`
const JumjoWorkSave = `
    exec PR_PLYB02_WRKMNG @cls, @cstCo, @useId, @ymd, @sTime, @eTime
`

module.exports = { DailyReport1, approve, jobClose, JumjoWorkSave }