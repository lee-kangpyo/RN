const AlbaJobSave = `
    exec PR_PLYC03_JOBCHECK 'AlbaJobSave', @ymd, '', @cstCo, @userId, @sTime, @eTime, @jobCl, @brkDure
`
const JumjuJobSave = `
    exec PR_PLYC03_JOBCHECK 'JumjuJobSave', @ymd, '', @cstCo, @userId, @sTime, @eTime, @jobCl, @brkDure

`

module.exports = {AlbaJobSave, JumjuJobSave}