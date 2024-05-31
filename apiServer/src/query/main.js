
const main02 = `
    exec PR_PLYA00_MAIN02 @cls, @cstCo, @userId, '', '', ''
`
const main01 = `
    exec PR_PLYA00_MAIN01 @cls, @cstCo, @userId, '', '', ''
`
const versionInfo = `
    SELECT * FROM VERSIONINFO WHERE PLATFORM = @platForm and USEYN = 'Y' order by NO DESC
`
const findId = `
    SELECT USERID FROM PLYMUSER WHERE USERNA = @userNa AND HPNO = @hpNo AND USEYN = 'Y'
`

const changePwByIdHpNo = `
    UPDATE a SET a.PASSWORD = @passWord, a.CRPYPW = PWDENCRYPT(@passWord), a.MUSERID = @userId, a.MYMDHMD = GETDATE()
    FROM PLYMUSER a WHERE a.USERID = @userId and a.HPNO = @hpNo
`

module.exports = { main02, main01, versionInfo, findId, changePwByIdHpNo }

