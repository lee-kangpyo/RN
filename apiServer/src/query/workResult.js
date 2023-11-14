


const albaWorkManager = `
    exec PR_PLYB01_WRKMNG  @cls, @cstCo, @userId, @ymdFR, @ymdTo, @jobCl, @jobDure
`
const monthCstSlySearch = `
    exec PR_PLYD02_SALARY @cls, @ymdFr, @ymdTo, @cstCo, @cstNa, @userId, @userNa, @rtCl
`


module.exports = { albaWorkManager, monthCstSlySearch}