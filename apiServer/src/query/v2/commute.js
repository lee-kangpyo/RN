const AlbaJobSave = `
    exec PR_PLYC03_JOBCHECK 'AlbaJobSave', @ymd, '', @cstCo, @userId, @sTime, @eTime, @jobCl, @brkDure
`

module.exports = {AlbaJobSave}