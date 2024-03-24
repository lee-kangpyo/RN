const searchSendTable = `
    select  a.MSGNO,
             CONVERT(CHAR(8), GETDATE(), 112) YMD,
            a.CSTCO, 
            a.SENDID, 
            isnull(a.RECIVEID, '') RECIVEID,
            isnull(a.TOKEN, b.TOKEN) TOKEN, 
            a.MSGID, a.CONTENT,
            CASE WHEN isnull(a.TOKEN, b.TOKEN) is null or isnull(a.TOKEN, b.TOKEN) = '' 
                 THEN '01'
                 ELSE '00' END STAT,
            GETDATE() SENDDATE,
            a.CREATEDATE,
            a.PARAM
    from PLYGMSGSEND a
    left join PLYMUSER b On a.RECIVEID = b.USERID
`

const delSendTable = `
    DELETE from PLYGMSGSEND WHERE MSGNO in 
`

const insertResultTable = `
    insert into PLYGMSGRESULT (YMD, CSTCO, SENDID, RECIVEID, TOKEN, MSGID, CONTENT, STAT, SENDDATE, LINK, CREATEDATE)
    select  
             CONVERT(CHAR(8), a.CREATEDATE, 112) YMD,
            a.CSTCO, a.SENDID, isnull(a.RECIVEID, ''),
            isnull(a.TOKEN, b.TOKEN) TOKEN, 
            a.MSGID, a.CONTENT,
            CASE WHEN isnull(a.TOKEN, b.TOKEN) is null or isnull(a.TOKEN, b.TOKEN) = '' THEN '01'
            ELSE '00' END STAT,
            GETDATE() SENDDATE,
            a.LINK,
            a.CREATEDATE
    from PLYGMSGSEND a
    left join PLYMUSER b On a.RECIVEID = b.USERID
    WHERE a.MSGNO in
`

module.exports = { searchSendTable, delSendTable, insertResultTable}