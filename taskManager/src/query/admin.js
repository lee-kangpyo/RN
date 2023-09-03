

const getTraceUserList = `
    SELECT DISTINCT USERID, UUID 
    FROM PLYUSERTRACE 
    WHERE UUID != ''
`;

const getMyusersTrace = `
    SELECT USERID, CSTCO, JOBYN, LAT, LON, DATE_FORMAT(CHKTIME, '%Y-%m-%d') YMD, DATE_FORMAT(CHKTIME, '%H:%i:%s') TIME, UUID FROM PLYUSERTRACE ORDER BY CHkTime
`;

const getMyuserTrace = `
    SELECT USERID, CSTCO, JOBYN, LAT, LON, DATE_FORMAT(CHKTIME, '%Y-%m-%d') YMD, DATE_FORMAT(CHKTIME, '%H:%i:%s') TIME, UUID 
    FROM PLYUSERTRACE 
    WHERE USERID = ?
    AND UUID = ?
    ORDER BY CHkTime
`;

module.exports = { getTraceUserList, getMyuserTrace, getMyuserTrace};