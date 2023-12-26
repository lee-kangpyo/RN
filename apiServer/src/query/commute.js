
const insertManualJobChk = `
    INSERT	PLYAJOBCHK(CSTCO, USERID, YMD, LAT, LON, CHKYN, APVYN, JOBCL, CHKTIME)
    VALUES ( @cstCo, @userId, CONVERT(CHAR(8), getDate(), 112), @lat, @lon, @chkYn, @apvYn, @jobCl, getDate())
`
const daySchedule = `
    exec PR_PLYA02_ALBASCHMNG @cls, @cstCo, @userId, @ymdFr, @ymdTo, '', '', ''
`

module.exports = {insertManualJobChk, daySchedule}