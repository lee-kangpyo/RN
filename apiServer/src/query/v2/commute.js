const AlbaJobSave = `
    exec PR_PLYC03_JOBCHECK 'AlbaJobSave', @ymd, '', @cstCo, @userId, @sTime, @eTime, @jobCl, @brkDure, @wage
`
const JumjuJobSave = `
    exec PR_PLYC03_JOBCHECK 'JumjuJobSave', @ymd, '', @cstCo, @userId, @sTime, @eTime, @jobCl, @brkDure, @wage

`

module.exports = {AlbaJobSave, JumjuJobSave}