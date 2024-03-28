const getTemplatePushMessage = `
    SELECT * 
    from PLYGMSGM 
    WHERE USEYN = 'Y'
    and CONVERT(CHAR(8), GETDATE(), 112) BETWEEN YMDFR AND YMDTO
    and MSGID = @msgId
`
const getTriggerInfo = `
    SELECT USERNA, USERID, HPNO, EMAIL, TOKEN from PLYMUSER WHERE USEYN = 'Y' AND USERID = @userId
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

const commuteInfo = `
    select top 1 usr.USERNA , cst.CSTNA, rcv.USERID receiveId, a.CHkNO, c.STARTTIME schStartTime, c.ENDTIME schEndTime, b.STARTTIME chkStartTime, b.ENDTIME chkEndTime
    from PLYADAYJOB b 
    inner join PLYMUSER usr On b.USERID = usr.USERID
    inner join PLYMCST cst On b.CSTCO = cst.CSTCO
    inner join PLYMCSTUSER cstUsr On cstUsr.ROLECL = 'ownr' and cst.CSTCO = cstUsr.CSTCO 
    inner join PLYMUSER rcv On cstUsr.USERID = rcv.USERID
    inner join PLYAJOBCHK a On a.CHKNO in(b.STARTCHKNO, b.ENDCHKNO) 
    left JOIN PLYADAYSCH c On b.CSTCO = c.CSTCO and b.USERID = c.USERID and b.YMD = c.YMD
    where  b.USERID = @userId 
    AND b.CSTCO = @cstCo
    and b.YMD = CONVERT(CHAR(8), getdate(), 112)
    order by a.CHKNO desc
`

module.exports = { getTemplatePushMessage, getTriggerInfo, getCstOwnrInfo, pushMsgSend, commuteInfo }