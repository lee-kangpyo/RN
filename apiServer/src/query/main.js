
const main02 = `
    exec PR_PLYA00_MAIN02 @cls, @cstCo, @userId, '', '', ''
`


const main01 = `
    exec PR_PLYA00_MAIN01 @cls, @cstCo, @userId, '', '', ''
`
const versionInfo = `
    SELECT * FROM VERSIONINFO WHERE PLATFORM = @platForm and USEYN = 'Y' order by NO DESC
`

module.exports = { main02, main01, versionInfo }

