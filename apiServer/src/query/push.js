const getTemplatePushMessage = `
    SELECT * 
    from PLYGMSGM 
    WHERE USEYN = 'Y'
    and CONVERT(CHAR(8), GETDATE(), 112) BETWEEN YMDFR AND YMDTO
    and MSGID = @msgId
`
const getSenderInfo = `
    SELECT USERNA, HPNO, EMAIL, TOKEN from PLYMUSER WHERE USEYN = 'Y' AND USERID = @userId
`

const getCstOwnrInfo = `
    --INSERT INTO PLYGMSGSEND (CSTCO, RECIVEID, MSGID, CONTENT, SENDID, CREATEDATE )
    SELECT a.CSTCO, a.CSTNA, c.USERID
    from PLYMCST a
    inner join PLYMCSTUSER b On a.cstco = b.CSTCO and ROLECL = 'ownr'
    inner join PLYMUSER c On b.USERID = c.USERID
    where a.cstco = @cstCo
`

const pushMsgSend = `
    INSERT INTO PLYGMSGSEND (CSTCO, RECIVEID, MSGID, CONTENT, SENDID, CREATEDATE, LINK )
    VALUES (@cstCo, @reciveId, @msgId, @content, @sendId, GETDATE(), @link)
`

module.exports = { getTemplatePushMessage, getSenderInfo, getCstOwnrInfo, pushMsgSend }