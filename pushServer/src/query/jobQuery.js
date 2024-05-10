const PR_PLYG01_MSGSEND = `
    exec PR_PLYG01_MSGSEND 'C0110_41', 0, '', @ymd, '', ''
`

const PR_JOB_CLOSE = `
    exec PR_JOB_CLOSE 'jobAutoPass', @ymdTo, @ymdFr, 0, '', 'Y'
`


module.exports = { PR_PLYG01_MSGSEND, PR_JOB_CLOSE}