const login = `
    SELECT * 
    FROM PLYMUSER 
    WHERE USERID = @userId 
    and PASSWORD = @passWord 
`
const test = `
    SELECT * 
    FROM PLYMUSER 
    WHERE USERID = @userId 
    or USERID != @userId 
`

const isIdDuplicate = `
    SELECT count(*) cnt
    FROM PLYMUSER 
    WHERE USERID = @userId 
`
const saveUser = `
    INSERT INTO PLYMUSER(USERID, USERNA, [PASSWORD], HPNO, STATCO, USEYN, IUSERID, IYMDHMD)
    VALUES(@userId, @userName, @passWord, @hpNo, '00', 'Y', @userId, GETDATE())
`

module.exports = {login, test, isIdDuplicate, saveUser}