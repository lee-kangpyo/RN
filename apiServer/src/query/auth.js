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

isIdDuplicate = `
    SELECT count(*) cnt
    FROM PLYMUSER 
    WHERE USERID = @userId 
`


module.exports = {login, test, isIdDuplicate}