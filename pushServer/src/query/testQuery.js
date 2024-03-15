const getUser = `
    select * from PLYMUSER WHERE userId = @userId
`

module.exports = { getUser }