
const DailyReport1 = `
    exec PR_PLYB02_WRKMNG 'DailyReport1', @cstCo, '', @ymd, '', ''
`

const approve = `
    UPDATE PLYADAYJOB SET APVYN = 'Y', MUSERID = @userId, MYMDHMD = getdate() 
    WHERE JOBNO in `

module.exports = { DailyReport1, approve }