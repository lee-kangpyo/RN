const createTmpStore = `
    INSERT INTO PLYMCST(CSTNA, CSTCL, TAXNO, ZIPNO, ZIPADDR, ADDR, REPNA, CONFYN, LAT, LON, USEYN, IUSERID, IYMDHMD)
    OUTPUT INSERTED.CSTCO
    VALUES(@cstNa, 'crew', '', '', '', '', '', 'N', '', '', 'Y', @userId, getdate())
`
const createCstUser = `
    INSERT INTO PLYMCSTUSER(CSTCO, USERID, ROLECL, JOBTYPE, WAGE, RTCL, IUSERID, IYMDHMD)
    VALUES(@cstCo, @userId, 'crew', null, @wage, 'N', @userId, GETDATE())
`

const updateTmpStore = `
    UPDATE PLYMCST SET CSTNA = @cstNa, MUSERID = @userId, MYMDHMD = GETDATE() WHERE CSTCO = @cstCo
`

const updateCstUser = `
    UPDATE PLYMCSTUSER SET WAGE = @wage, MUSERID = @userId, MYMDHMD = GETDATE() WHERE CSTCO = @cstCo AND USERID = @userId
`

module.exports = { createTmpStore, createCstUser, updateTmpStore, updateCstUser }